import Vue from './instance/index.js';
export { default } from './instance/index.js';
import { initGlobalAPI } from './global-api/index.js';
import { isServerRendering } from './util/env.js';
import { FunctionalRenderContext } from './vdom/create-functional-component.js';

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.14';
