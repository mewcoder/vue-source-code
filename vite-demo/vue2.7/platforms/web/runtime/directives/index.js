/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import directive from './model.js';
import show from './show.js';

var platformDirectives = {
    model: directive,
    show: show
};

export { platformDirectives as default };
