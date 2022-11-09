import { SourceMapGenerator } from '../../../node_modules/.pnpm/source-map@0.6.1/node_modules/source-map/source-map.js';
import { parseComponent, DEFAULT_FILENAME } from './parseComponent.js';
import hashSum from '../../../node_modules/.pnpm/hash-sum@2.0.0/node_modules/hash-sum/hash-sum.js';
import lruCache from '../../../node_modules/.pnpm/lru-cache@5.1.1/node_modules/lru-cache/index.js';
import { hmrShouldReload } from './compileScript.js';
import { parseCssVars } from './cssVars.js';

const cache = new lruCache(100);
const splitRE = /\r?\n/g;
const emptyRE = /^(?:\/\/)?\s*$/;
function parse(options) {
    const { source, filename = DEFAULT_FILENAME, compiler, compilerParseOptions = { pad: false }, sourceRoot = '', needMap = true, sourceMap = needMap } = options;
    const cacheKey = hashSum(filename + source + JSON.stringify(compilerParseOptions));
    let output = cache.get(cacheKey);
    if (output) {
        return output;
    }
    if (compiler) {
        // user-provided compiler
        output = compiler.parseComponent(source, compilerParseOptions);
    }
    else {
        // use built-in compiler
        output = parseComponent(source, compilerParseOptions);
    }
    output.filename = filename;
    // parse CSS vars
    output.cssVars = parseCssVars(output);
    output.shouldForceReload = prevImports => hmrShouldReload(prevImports, output);
    if (sourceMap) {
        if (output.script && !output.script.src) {
            output.script.map = generateSourceMap(filename, source, output.script.content, sourceRoot, compilerParseOptions.pad);
        }
        if (output.styles) {
            output.styles.forEach(style => {
                if (!style.src) {
                    style.map = generateSourceMap(filename, source, style.content, sourceRoot, compilerParseOptions.pad);
                }
            });
        }
    }
    cache.set(cacheKey, output);
    return output;
}
function generateSourceMap(filename, source, generated, sourceRoot, pad) {
    const map = new SourceMapGenerator({
        file: filename.replace(/\\/g, '/'),
        sourceRoot: sourceRoot.replace(/\\/g, '/')
    });
    let offset = 0;
    if (!pad) {
        offset = source.split(generated).shift().split(splitRE).length - 1;
    }
    map.setSourceContent(filename, source);
    generated.split(splitRE).forEach((line, index) => {
        if (!emptyRE.test(line)) {
            map.addMapping({
                source: filename,
                original: {
                    line: index + 1 + offset,
                    column: 0
                },
                generated: {
                    line: index + 1,
                    column: 0
                }
            });
        }
    });
    return JSON.parse(map.toString());
}

export { parse };
