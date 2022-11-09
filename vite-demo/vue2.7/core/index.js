/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import Vue from './instance/index.js';
export { default } from './instance/index.js';
import { initGlobalAPI } from './global-api/index.js';
import { isServerRendering } from './util/env.js';
import { FunctionalRenderContext } from './vdom/create-functional-component.js';
import { version } from '../v3/index.js';

initGlobalAPI(Vue);
Object.defineProperty(Vue.prototype, '$isServer', {
    get: isServerRendering
});
Object.defineProperty(Vue.prototype, '$ssrContext', {
    get: function () {
        /* istanbul ignore next */
        return this.$vnode && this.$vnode.ssrContext;
    }
});
// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
    value: FunctionalRenderContext
});
Vue.version = version;
