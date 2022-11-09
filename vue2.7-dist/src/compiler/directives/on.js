import '../../shared/util.js';
import '../../core/util/env.js';
import '../../core/util/options.js';
import { warn } from '../../core/util/debug.js';
import '../../core/observer/dep.js';
import '../../core/observer/array.js';
import '../../core/observer/traverse.js';
import '../../core/observer/scheduler.js';
import '../../core/config.js';
import '../../core/instance/proxy.js';
import '../../core/util/perf.js';
import '../../core/vdom/create-functional-component.js';
import '../../core/util/next-tick.js';

function on(el, dir) {
    if (process.env.NODE_ENV !== 'production' && dir.modifiers) {
        warn(`v-on without argument does not support modifiers.`);
    }
    el.wrapListeners = (code) => `_g(${code},${dir.value})`;
}

export { on as default };
