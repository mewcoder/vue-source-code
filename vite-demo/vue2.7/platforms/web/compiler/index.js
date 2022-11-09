/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import { baseOptions } from './options.js';
import { createCompiler } from '../../../compiler/index.js';

var _a = createCompiler(baseOptions), compileToFunctions = _a.compileToFunctions;

export { compileToFunctions };
