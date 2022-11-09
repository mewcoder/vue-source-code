import * as nodeOps from './node-ops.js';
import { createPatchFunction } from '../../../core/vdom/patch.js';
import baseModules from '../../../core/vdom/modules/index.js';
import platformModules from './modules/index.js';

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules);

const patch = createPatchFunction({ nodeOps, modules });

export { patch };
