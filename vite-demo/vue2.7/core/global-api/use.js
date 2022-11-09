/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import { toArray, isFunction } from '../../shared/util.js';
import '../util/env.js';
import '../util/options.js';
import '../util/debug.js';
import '../observer/index.js';
import '../observer/dep.js';
import '../util/next-tick.js';

function initUse(Vue) {
    Vue.use = function (plugin) {
        var installedPlugins = this._installedPlugins || (this._installedPlugins = []);
        if (installedPlugins.indexOf(plugin) > -1) {
            return this;
        }
        // additional parameters
        var args = toArray(arguments, 1);
        args.unshift(this);
        if (isFunction(plugin.install)) {
            plugin.install.apply(plugin, args);
        }
        else if (isFunction(plugin)) {
            plugin.apply(null, args);
        }
        installedPlugins.push(plugin);
        return this;
    };
}

export { initUse };
