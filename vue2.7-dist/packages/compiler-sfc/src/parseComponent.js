import deIndent from '../../../node_modules/.pnpm/de-indent@1.0.2/node_modules/de-indent/index.js';
import { parseHTML } from '../../../src/compiler/parser/html-parser.js';
import { makeMap } from '../../../src/shared/util.js';

const DEFAULT_FILENAME = 'anonymous.vue';
const splitRE = /\r?\n/g;
const replaceRE = /./g;
const isSpecialTag = makeMap('script,style,template', true);
/**
 * Parse a single-file component (*.vue) file into an SFC Descriptor Object.
 */
function parseComponent(source, options = {}) {
    const sfc = {
        source,
        filename: DEFAULT_FILENAME,
        template: null,
        script: null,
        scriptSetup: null,
        styles: [],
        customBlocks: [],
        cssVars: [],
        errors: [],
        shouldForceReload: null // attached in parse() by compiler-sfc
    };
    let depth = 0;
    let currentBlock = null;
    let warn = msg => {
        sfc.errors.push(msg);
    };
    if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
        warn = (msg, range) => {
            const data = { msg };
            if (range.start != null) {
                data.start = range.start;
            }
            if (range.end != null) {
                data.end = range.end;
            }
            sfc.errors.push(data);
        };
    }
    function start(tag, attrs, unary, start, end) {
        if (depth === 0) {
            currentBlock = {
                type: tag,
                content: '',
                start: end,
                end: 0,
                attrs: attrs.reduce((cumulated, { name, value }) => {
                    cumulated[name] = value || true;
                    return cumulated;
                }, {})
            };
            if (typeof currentBlock.attrs.src === 'string') {
                currentBlock.src = currentBlock.attrs.src;
            }
            if (isSpecialTag(tag)) {
                checkAttrs(currentBlock, attrs);
                if (tag === 'script') {
                    const block = currentBlock;
                    if (block.attrs.setup) {
                        block.setup = currentBlock.attrs.setup;
                        sfc.scriptSetup = block;
                    }
                    else {
                        sfc.script = block;
                    }
                }
                else if (tag === 'style') {
                    sfc.styles.push(currentBlock);
                }
                else {
                    sfc[tag] = currentBlock;
                }
            }
            else {
                // custom blocks
                sfc.customBlocks.push(currentBlock);
            }
        }
        if (!unary) {
            depth++;
        }
    }
    function checkAttrs(block, attrs) {
        for (let i = 0; i < attrs.length; i++) {
            const attr = attrs[i];
            if (attr.name === 'lang') {
                block.lang = attr.value;
            }
            if (attr.name === 'scoped') {
                block.scoped = true;
            }
            if (attr.name === 'module') {
                block.module = attr.value || true;
            }
        }
    }
    function end(tag, start) {
        if (depth === 1 && currentBlock) {
            currentBlock.end = start;
            let text = source.slice(currentBlock.start, currentBlock.end);
            if (options.deindent === true ||
                // by default, deindent unless it's script with default lang or (j/t)sx?
                (options.deindent !== false &&
                    !(currentBlock.type === 'script' &&
                        (!currentBlock.lang || /^(j|t)sx?$/.test(currentBlock.lang))))) {
                text = deIndent(text);
            }
            // pad content so that linters and pre-processors can output correct
            // line numbers in errors and warnings
            if (currentBlock.type !== 'template' && options.pad) {
                text = padContent(currentBlock, options.pad) + text;
            }
            currentBlock.content = text;
            currentBlock = null;
        }
        depth--;
    }
    function padContent(block, pad) {
        if (pad === 'space') {
            return source.slice(0, block.start).replace(replaceRE, ' ');
        }
        else {
            const offset = source.slice(0, block.start).split(splitRE).length;
            const padChar = block.type === 'script' && !block.lang ? '//\n' : '\n';
            return Array(offset).join(padChar);
        }
    }
    parseHTML(source, {
        warn,
        start,
        end,
        outputSourceRange: options.outputSourceRange
    });
    return sfc;
}

export { DEFAULT_FILENAME, parseComponent };
