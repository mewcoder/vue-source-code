/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
function bind(el, dir) {
    el.wrapData = function (code) {
        return "_b(".concat(code, ",'").concat(el.tag, "',").concat(dir.value, ",").concat(dir.modifiers && dir.modifiers.prop ? 'true' : 'false').concat(dir.modifiers && dir.modifiers.sync ? ',true' : '', ")");
    };
}

export { bind as default };
