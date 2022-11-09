import assetUrlsModule from './templateCompilerModules/assetUrl.js';
import srcsetModule from './templateCompilerModules/srcset.js';
import consolidate from '../../../node_modules/.pnpm/@vue_consolidate@0.17.3/node_modules/@vue/consolidate/index.js';
import * as entryCompiler from '../../../src/platforms/web/entry-compiler.js';
import { prefixIdentifiers } from './prefixIdentifiers.js';

function compileTemplate(options) {
    const { preprocessLang } = options;
    const preprocessor = preprocessLang && consolidate[preprocessLang];
    if (preprocessor) {
        return actuallyCompile(Object.assign({}, options, {
            source: preprocess(options, preprocessor)
        }));
    }
    else if (preprocessLang) {
        return {
            ast: {},
            code: `var render = function () {}\n` + `var staticRenderFns = []\n`,
            source: options.source,
            tips: [
                `Component ${options.filename} uses lang ${preprocessLang} for template. Please install the language preprocessor.`
            ],
            errors: [
                `Component ${options.filename} uses lang ${preprocessLang} for template, however it is not installed.`
            ]
        };
    }
    else {
        return actuallyCompile(options);
    }
}
function preprocess(options, preprocessor) {
    const { source, filename, preprocessOptions } = options;
    const finalPreprocessOptions = Object.assign({
        filename
    }, preprocessOptions);
    // Consolidate exposes a callback based API, but the callback is in fact
    // called synchronously for most templating engines. In our case, we have to
    // expose a synchronous API so that it is usable in Jest transforms (which
    // have to be sync because they are applied via Node.js require hooks)
    let res, err;
    preprocessor.render(source, finalPreprocessOptions, (_err, _res) => {
        if (_err)
            err = _err;
        res = _res;
    });
    if (err)
        throw err;
    return res;
}
function actuallyCompile(options) {
    const { source, compiler = entryCompiler, compilerOptions = {}, transpileOptions = {}, transformAssetUrls, transformAssetUrlsOptions, isProduction = process.env.NODE_ENV === 'production', isFunctional = false, optimizeSSR = false, prettify = true, isTS = false, bindings } = options;
    const compile = optimizeSSR && compiler.ssrCompile ? compiler.ssrCompile : compiler.compile;
    let finalCompilerOptions = compilerOptions;
    if (transformAssetUrls) {
        const builtInModules = [
            transformAssetUrls === true
                ? assetUrlsModule(undefined, transformAssetUrlsOptions)
                : assetUrlsModule(transformAssetUrls, transformAssetUrlsOptions),
            srcsetModule(transformAssetUrlsOptions)
        ];
        finalCompilerOptions = Object.assign({}, compilerOptions, {
            modules: [...builtInModules, ...(compilerOptions.modules || [])],
            filename: options.filename
        });
    }
    finalCompilerOptions.bindings = bindings;
    const { ast, render, staticRenderFns, tips, errors } = compile(source, finalCompilerOptions);
    if (errors && errors.length) {
        return {
            ast,
            code: `var render = function () {}\n` + `var staticRenderFns = []\n`,
            source,
            tips,
            errors
        };
    }
    else {
        // stripping `with` usage
        let code = `var __render__ = ${prefixIdentifiers(`function render(${isFunctional ? `_c,_vm` : ``}){${render}\n}`, isFunctional, isTS, transpileOptions, bindings)}\n` +
            `var __staticRenderFns__ = [${staticRenderFns.map(code => prefixIdentifiers(`function (${isFunctional ? `_c,_vm` : ``}){${code}\n}`, isFunctional, isTS, transpileOptions, bindings))}]` +
            `\n`;
        // #23 we use __render__ to avoid `render` not being prefixed by the
        // transpiler when stripping with, but revert it back to `render` to
        // maintain backwards compat
        code = code.replace(/\s__(render|staticRenderFns)__\s/g, ' $1 ');
        if (!isProduction) {
            // mark with stripped (this enables Vue to use correct runtime proxy
            // detection)
            code += `render._withStripped = true`;
            if (prettify) {
                try {
                    code = require('prettier').format(code, {
                        semi: false,
                        parser: 'babel'
                    });
                }
                catch (e) {
                    if (e.code === 'MODULE_NOT_FOUND') {
                        tips.push('The `prettify` option is on, but the dependency `prettier` is not found.\n' +
                            'Please either turn off `prettify` or manually install `prettier`.');
                    }
                    tips.push(`Failed to prettify component ${options.filename} template source after compilation.`);
                }
            }
        }
        return {
            ast,
            code,
            source,
            tips,
            errors
        };
    }
}

export { compileTemplate };
