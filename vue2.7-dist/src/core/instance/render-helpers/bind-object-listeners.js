import { isPlainObject, extend } from '../../../shared/util.js';
import '../../util/env.js';
import '../../util/options.js';
import { warn } from '../../util/debug.js';
import '../../observer/dep.js';
import '../../observer/array.js';
import '../../observer/traverse.js';
import '../../observer/scheduler.js';
import '../proxy.js';
import '../../util/perf.js';
import '../../vdom/create-functional-component.js';
import '../../util/next-tick.js';

function bindObjectListeners(data, value) {
    if (value) {
        if (!isPlainObject(value)) {
            warn('v-on without argument expects an Object value', this);
        }
        else {
            const on = (data.on = data.on ? extend({}, data.on) : {});
            for (const key in value) {
                const existing = on[key];
                const ours = value[key];
                on[key] = existing ? [].concat(existing, ours) : ours;
            }
        }
    }
    return data;
}

export { bindObjectListeners };
