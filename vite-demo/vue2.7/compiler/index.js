/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import { parse } from './parser/index.js';
import { optimize } from './optimizer.js';
import { generate } from './codegen/index.js';
import { createCompilerCreator } from './create-compiler.js';

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
var createCompiler = createCompilerCreator(function baseCompile(template, options) {
    var ast = parse(template.trim(), options);
    if (options.optimize !== false) {
        optimize(ast, options);
    }
    var code = generate(ast, options);
    return {
        ast: ast,
        render: code.render,
        staticRenderFns: code.staticRenderFns
    };
});

export { createCompiler };
