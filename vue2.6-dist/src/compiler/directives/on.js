import '../../shared/util.js';
import '../../core/util/env.js';
import '../../core/util/options.js';
import { warn } from '../../core/util/debug.js';
import '../../core/observer/dep.js';
import '../../core/observer/array.js';
import '../../core/util/next-tick.js';

/*  */

function on (el, dir) {
  if (dir.modifiers) {
    warn(`v-on without argument does not support modifiers.`);
  }
  el.wrapListeners = (code) => `_g(${code},${dir.value})`;
}

export { on as default };
