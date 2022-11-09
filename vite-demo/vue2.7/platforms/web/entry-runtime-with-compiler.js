/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import './runtime-with-compiler.js';
import * as index from '../../v3/index.js';
import { extend } from '../../shared/util.js';
import { effect } from '../../v3/reactivity/effect.js';
import './runtime/index.js';
import '../../core/index.js';
import Vue from '../../core/instance/index.js';
export { default } from '../../core/instance/index.js';

extend(Vue, index);
Vue.effect = effect;
