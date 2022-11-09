import hashSum from '../../../node_modules/.pnpm/hash-sum@2.0.0/node_modules/hash-sum/hash-sum.js';
import { prefixIdentifiers } from './prefixIdentifiers.js';

const CSS_VARS_HELPER = `useCssVars`;
function genCssVarsFromList(vars, id, isProd, isSSR = false) {
    return `{\n  ${vars
        .map(key => `"${isSSR ? `--` : ``}${genVarName(id, key, isProd)}": (${key})`)
        .join(',\n  ')}\n}`;
}
function genVarName(id, raw, isProd) {
    if (isProd) {
        return hashSum(id + raw);
    }
    else {
        return `${id}-${raw.replace(/([^\w-])/g, '_')}`;
    }
}
function normalizeExpression(exp) {
    exp = exp.trim();
    if ((exp[0] === `'` && exp[exp.length - 1] === `'`) ||
        (exp[0] === `"` && exp[exp.length - 1] === `"`)) {
        return exp.slice(1, -1);
    }
    return exp;
}
const vBindRE = /v-bind\s*\(/g;
function parseCssVars(sfc) {
    const vars = [];
    sfc.styles.forEach(style => {
        let match;
        // ignore v-bind() in comments /* ... */
        const content = style.content.replace(/\/\*([\s\S]*?)\*\//g, '');
        while ((match = vBindRE.exec(content))) {
            const start = match.index + match[0].length;
            const end = lexBinding(content, start);
            if (end !== null) {
                const variable = normalizeExpression(content.slice(start, end));
                if (!vars.includes(variable)) {
                    vars.push(variable);
                }
            }
        }
    });
    return vars;
}
function lexBinding(content, start) {
    let state = 0 /* LexerState.inParens */;
    let parenDepth = 0;
    for (let i = start; i < content.length; i++) {
        const char = content.charAt(i);
        switch (state) {
            case 0 /* LexerState.inParens */:
                if (char === `'`) {
                    state = 1 /* LexerState.inSingleQuoteString */;
                }
                else if (char === `"`) {
                    state = 2 /* LexerState.inDoubleQuoteString */;
                }
                else if (char === `(`) {
                    parenDepth++;
                }
                else if (char === `)`) {
                    if (parenDepth > 0) {
                        parenDepth--;
                    }
                    else {
                        return i;
                    }
                }
                break;
            case 1 /* LexerState.inSingleQuoteString */:
                if (char === `'`) {
                    state = 0 /* LexerState.inParens */;
                }
                break;
            case 2 /* LexerState.inDoubleQuoteString */:
                if (char === `"`) {
                    state = 0 /* LexerState.inParens */;
                }
                break;
        }
    }
    return null;
}
const cssVarsPlugin = opts => {
    const { id, isProd } = opts;
    return {
        postcssPlugin: 'vue-sfc-vars',
        Declaration(decl) {
            // rewrite CSS variables
            const value = decl.value;
            if (vBindRE.test(value)) {
                vBindRE.lastIndex = 0;
                let transformed = '';
                let lastIndex = 0;
                let match;
                while ((match = vBindRE.exec(value))) {
                    const start = match.index + match[0].length;
                    const end = lexBinding(value, start);
                    if (end !== null) {
                        const variable = normalizeExpression(value.slice(start, end));
                        transformed +=
                            value.slice(lastIndex, match.index) +
                                `var(--${genVarName(id, variable, isProd)})`;
                        lastIndex = end + 1;
                    }
                }
                decl.value = transformed + value.slice(lastIndex);
            }
        }
    };
};
cssVarsPlugin.postcss = true;
function genCssVarsCode(vars, bindings, id, isProd) {
    const varsExp = genCssVarsFromList(vars, id, isProd);
    return `_${CSS_VARS_HELPER}((_vm, _setup) => ${prefixIdentifiers(`(${varsExp})`, false, false, undefined, bindings)})`;
}
// <script setup> already gets the calls injected as part of the transform
// this is only for single normal <script>
function genNormalScriptCssVarsCode(cssVars, bindings, id, isProd) {
    return (`\nimport { ${CSS_VARS_HELPER} as _${CSS_VARS_HELPER} } from 'vue'\n` +
        `const __injectCSSVars__ = () => {\n${genCssVarsCode(cssVars, bindings, id, isProd)}}\n` +
        `const __setup__ = __default__.setup\n` +
        `__default__.setup = __setup__\n` +
        `  ? (props, ctx) => { __injectCSSVars__();return __setup__(props, ctx) }\n` +
        `  : __injectCSSVars__\n`);
}

export { CSS_VARS_HELPER, cssVarsPlugin, genCssVarsCode, genCssVarsFromList, genNormalScriptCssVarsCode, parseCssVars };
