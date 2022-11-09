/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import { addProp } from '../../../../compiler/helpers.js';

function text(el, dir) {
    if (dir.value) {
        addProp(el, 'textContent', "_s(".concat(dir.value, ")"), dir);
    }
}

export { text as default };
