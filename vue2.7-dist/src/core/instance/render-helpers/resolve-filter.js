import { identity } from '../../../shared/util.js';
import '../../util/env.js';
import { resolveAsset } from '../../util/options.js';
import '../../util/debug.js';
import '../../observer/dep.js';
import '../../observer/array.js';
import '../../observer/traverse.js';
import '../../observer/scheduler.js';
import '../proxy.js';
import '../../util/perf.js';
import '../../vdom/create-functional-component.js';
import '../../util/next-tick.js';

/**
 * Runtime helper for resolving filters
 */
function resolveFilter(id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity;
}

export { resolveFilter };
