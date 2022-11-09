/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
var decoder;
var he = {
    decode: function (html) {
        decoder = decoder || document.createElement('div');
        decoder.innerHTML = html;
        return decoder.textContent;
    }
};

export { he as default };
