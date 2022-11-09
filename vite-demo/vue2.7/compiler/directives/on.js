/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import '../../shared/util.js';
import '../../core/util/env.js';
import '../../core/util/options.js';
import { warn } from '../../core/util/debug.js';
import '../../core/observer/index.js';
import '../../core/observer/dep.js';
import '../../core/util/next-tick.js';

function on(el, dir) {
    if (dir.modifiers) {
        warn("v-on without argument does not support modifiers.");
    }
    el.wrapListeners = function (code) { return "_g(".concat(code, ",").concat(dir.value, ")"); };
}

export { on as default };
