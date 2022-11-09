/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import * as nodeOps from './node-ops.js';
import { createPatchFunction } from '../../../core/vdom/patch.js';
import baseModules from '../../../core/vdom/modules/index.js';
import platformModules from './modules/index.js';

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);
var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

export { patch };
