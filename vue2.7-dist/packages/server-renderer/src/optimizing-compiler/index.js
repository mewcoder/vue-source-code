import { parse } from '../../../../src/compiler/parser/index.js';
import { generate } from './codegen.js';
import { optimize } from './optimizer.js';
import { createCompilerCreator } from '../../../../src/compiler/create-compiler.js';

const createCompiler = createCompilerCreator(function baseCompile(template, options) {
    const ast = parse(template.trim(), options);
    optimize(ast, options);
    const code = generate(ast, options);
    return {
        ast,
        render: code.render,
        staticRenderFns: code.staticRenderFns
    };
});

export { createCompiler };
