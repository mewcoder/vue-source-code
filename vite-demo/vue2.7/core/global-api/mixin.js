/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import '../../shared/util.js';
import '../util/env.js';
import { mergeOptions } from '../util/options.js';
import '../util/debug.js';
import '../observer/index.js';
import '../observer/dep.js';
import '../util/next-tick.js';

function initMixin(Vue) {
    Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin);
        return this;
    };
}

export { initMixin };
