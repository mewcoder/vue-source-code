import '../../../core/index.js';
import config from '../../../core/config.js';
import { extend, noop } from '../../../shared/util.js';
import { mountComponent } from '../../../core/instance/lifecycle.js';
import { inBrowser, devtools } from '../../../core/util/env.js';
import '../../../core/util/options.js';
import '../../../core/util/debug.js';
import '../../../core/observer/dep.js';
import '../../../core/observer/array.js';
import '../../../core/util/next-tick.js';
import { query } from '../util/index.js';
import { patch } from './patch.js';
import platformDirectives from './directives/index.js';
import platformComponents from './components/index.js';
import Vue from '../../../core/instance/index.js';
export { default } from '../../../core/instance/index.js';
import { mustUseProp, isReservedAttr } from '../util/attrs.js';
import { isReservedTag, getTagNamespace, isUnknownElement } from '../util/element.js';

/*  */

// install platform specific utils
Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);

// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(() => {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue);
      } else {
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
          'https://github.com/vuejs/vue-devtools'
        );
      }
    }
    if (config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      console[console.info ? 'info' : 'log'](
        `You are running Vue in development mode.\n` +
        `Make sure to turn on production mode when deploying for production.\n` +
        `See more tips at https://vuejs.org/guide/deployment.html`
      );
    }
  }, 0);
}
