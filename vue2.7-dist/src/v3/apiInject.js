import { isFunction } from '../shared/util.js';
import '../core/util/env.js';
import '../core/util/options.js';
import { warn } from '../core/util/debug.js';
import '../core/observer/dep.js';
import '../core/observer/array.js';
import '../core/observer/traverse.js';
import '../core/observer/scheduler.js';
import { currentInstance } from './currentInstance.js';
import '../core/instance/proxy.js';
import '../core/util/perf.js';
import '../core/vdom/create-functional-component.js';
import '../core/util/next-tick.js';

function provide(key, value) {
    if (!currentInstance) {
        {
            warn(`provide() can only be used inside setup().`);
        }
    }
    else {
        // TS doesn't allow symbol as index type
        resolveProvided(currentInstance)[key] = value;
    }
}
function resolveProvided(vm) {
    // by default an instance inherits its parent's provides object
    // but when it needs to provide values of its own, it creates its
    // own provides object using parent provides object as prototype.
    // this way in `inject` we can simply look up injections from direct
    // parent and let the prototype chain do the work.
    const existing = vm._provided;
    const parentProvides = vm.$parent && vm.$parent._provided;
    if (parentProvides === existing) {
        return (vm._provided = Object.create(parentProvides));
    }
    else {
        return existing;
    }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
    // fallback to `currentRenderingInstance` so that this can be called in
    // a functional component
    const instance = currentInstance;
    if (instance) {
        // #2400
        // to support `app.use` plugins,
        // fallback to appContext's `provides` if the instance is at root
        const provides = instance.$parent && instance.$parent._provided;
        if (provides && key in provides) {
            // TS doesn't allow symbol as index type
            return provides[key];
        }
        else if (arguments.length > 1) {
            return treatDefaultAsFactory && isFunction(defaultValue)
                ? defaultValue.call(instance)
                : defaultValue;
        }
        else {
            warn(`injection "${String(key)}" not found.`);
        }
    }
    else {
        warn(`inject() can only be used inside setup() or functional components.`);
    }
}

export { inject, provide, resolveProvided };
