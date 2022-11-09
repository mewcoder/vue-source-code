/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import { isPlainObject, extend } from '../../../shared/util.js';
import '../../util/env.js';
import '../../util/options.js';
import { warn } from '../../util/debug.js';
import '../../observer/index.js';
import '../../observer/dep.js';
import '../../util/next-tick.js';

function bindObjectListeners(data, value) {
    if (value) {
        if (!isPlainObject(value)) {
            warn('v-on without argument expects an Object value', this);
        }
        else {
            var on = (data.on = data.on ? extend({}, data.on) : {});
            for (var key in value) {
                var existing = on[key];
                var ours = value[key];
                on[key] = existing ? [].concat(existing, ours) : ours;
            }
        }
    }
    return data;
}

export { bindObjectListeners };
