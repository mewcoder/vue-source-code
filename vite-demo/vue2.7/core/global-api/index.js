/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import config from '../config.js';
import { initUse } from './use.js';
import { initMixin } from './mixin.js';
import { initExtend } from './extend.js';
import { initAssetRegisters } from './assets.js';
import { defineReactive, set, del, observe } from '../observer/index.js';
import { ASSET_TYPES } from '../../shared/constants.js';
import builtInComponents from '../components/index.js';
import { extend } from '../../shared/util.js';
import '../util/env.js';
import { mergeOptions } from '../util/options.js';
import { warn } from '../util/debug.js';
import '../observer/dep.js';
import { nextTick } from '../util/next-tick.js';

function initGlobalAPI(Vue) {
    // config
    var configDef = {};
    configDef.get = function () { return config; };
    {
        configDef.set = function () {
            warn('Do not replace the Vue.config object, set individual fields instead.');
        };
    }
    Object.defineProperty(Vue, 'config', configDef);
    // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    Vue.util = {
        warn: warn,
        extend: extend,
        mergeOptions: mergeOptions,
        defineReactive: defineReactive
    };
    Vue.set = set;
    Vue.delete = del;
    Vue.nextTick = nextTick;
    // 2.6 explicit observable API
    Vue.observable = function (obj) {
        observe(obj);
        return obj;
    };
    Vue.options = Object.create(null);
    ASSET_TYPES.forEach(function (type) {
        Vue.options[type + 's'] = Object.create(null);
    });
    // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    Vue.options._base = Vue;
    extend(Vue.options.components, builtInComponents);
    initUse(Vue);
    initMixin(Vue);
    initExtend(Vue);
    initAssetRegisters(Vue);
}

export { initGlobalAPI };
