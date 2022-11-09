/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import { initMixin } from './init.js';
import { stateMixin } from './state.js';
import { renderMixin } from './render.js';
import { eventsMixin } from './events.js';
import { lifecycleMixin } from './lifecycle.js';
import '../../shared/util.js';
import '../util/env.js';
import '../util/options.js';
import { warn } from '../util/debug.js';
import '../observer/index.js';
import '../observer/dep.js';
import '../util/next-tick.js';

function Vue(options) {
    if (!(this instanceof Vue)) {
        warn('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options);
}
//@ts-expect-error Vue has function type
initMixin(Vue);
//@ts-expect-error Vue has function type
stateMixin(Vue);
//@ts-expect-error Vue has function type
eventsMixin(Vue);
//@ts-expect-error Vue has function type
lifecycleMixin(Vue);
//@ts-expect-error Vue has function type
renderMixin(Vue);

export { Vue as default };
