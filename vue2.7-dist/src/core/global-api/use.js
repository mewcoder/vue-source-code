import { toArray, isFunction } from '../../shared/util.js';
import '../util/env.js';
import '../util/options.js';
import '../util/debug.js';
import '../observer/dep.js';
import '../observer/array.js';
import '../observer/traverse.js';
import '../observer/scheduler.js';
import '../instance/proxy.js';
import '../util/perf.js';
import '../vdom/create-functional-component.js';
import '../util/next-tick.js';

function initUse(Vue) {
    Vue.use = function (plugin) {
        const installedPlugins = this._installedPlugins || (this._installedPlugins = []);
        if (installedPlugins.indexOf(plugin) > -1) {
            return this;
        }
        // additional parameters
        const args = toArray(arguments, 1);
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
