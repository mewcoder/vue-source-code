import { baseOptions } from '../../../src/platforms/web/compiler/options.js';
import { createCompiler } from './optimizing-compiler/index.js';

const { compile, compileToFunctions } = createCompiler(baseOptions);

export { compile as ssrCompile, compileToFunctions as ssrCompileToFunctions };
