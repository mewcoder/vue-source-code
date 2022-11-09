import { initMixin } from './init.js';
import { stateMixin } from './state.js';
import { renderMixin } from './render.js';
import { eventsMixin } from './events.js';
import { lifecycleMixin } from './lifecycle.js';
import '../../shared/util.js';
import '../util/env.js';
import '../util/options.js';
import { warn } from '../util/debug.js';
import '../observer/dep.js';
import '../observer/array.js';
import '../util/next-tick.js';

function Vue (options) {
  if (!(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

export { Vue as default };
