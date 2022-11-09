import '../../shared/util.js';
import '../util/env.js';
import { mergeOptions } from '../util/options.js';
import '../util/debug.js';
import '../observer/dep.js';
import '../observer/array.js';
import '../util/next-tick.js';

/*  */

function initMixin (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

export { initMixin };
