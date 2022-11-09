import '../../core/observer/dep.js';
import '../../core/observer/array.js';
import '../../shared/util.js';
import '../../core/util/env.js';
import '../../core/util/options.js';
import '../../core/util/debug.js';
import '../../core/config.js';
import '../../core/util/next-tick.js';
import '../../core/observer/traverse.js';
import '../../core/observer/scheduler.js';
import '../../core/instance/proxy.js';
import '../../core/util/perf.js';
import '../../core/vdom/create-functional-component.js';

function isRef(r) {
    return !!(r && r.__v_isRef === true);
}

export { isRef };
