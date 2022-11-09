/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import { identity } from '../../../shared/util.js';
import '../../util/env.js';
import { resolveAsset } from '../../util/options.js';
import '../../util/debug.js';
import '../../observer/index.js';
import '../../observer/dep.js';
import '../../util/next-tick.js';

/**
 * Runtime helper for resolving filters
 */
function resolveFilter(id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity;
}

export { resolveFilter };
