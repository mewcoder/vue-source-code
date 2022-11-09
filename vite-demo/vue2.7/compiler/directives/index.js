/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import on from './on.js';
import bind from './bind.js';
import { noop } from '../../shared/util.js';

var baseDirectives = {
    on: on,
    bind: bind,
    cloak: noop
};

export { baseDirectives as default };
