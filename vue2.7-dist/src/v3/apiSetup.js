import { pushTarget, popTarget } from '../core/observer/dep.js';
import { isArray, isFunction, isObject, bind, emptyObject } from '../shared/util.js';
import { isReserved, def } from '../core/util/lang.js';
import '../core/util/env.js';
import '../core/util/options.js';
import { warn } from '../core/util/debug.js';
import VNode from '../core/vdom/vnode.js';
import '../core/observer/array.js';
import { proxyWithRefUnwrap } from './reactivity/ref.js';
import { shallowReactive } from './reactivity/reactive.js';
import '../core/observer/traverse.js';
import '../core/observer/scheduler.js';
import { currentInstance, setCurrentInstance } from './currentInstance.js';
import '../core/instance/proxy.js';
import '../core/util/perf.js';
import '../core/vdom/create-functional-component.js';
import '../core/util/next-tick.js';
import { invokeWithErrorHandling } from '../core/util/error.js';

function initSetup(vm) {
    const options = vm.$options;
    const setup = options.setup;
    if (setup) {
        const ctx = (vm._setupContext = createSetupContext(vm));
        setCurrentInstance(vm);
        pushTarget();
        const setupResult = invokeWithErrorHandling(setup, null, [vm._props || shallowReactive({}), ctx], vm, `setup`);
        popTarget();
        setCurrentInstance();
        if (isFunction(setupResult)) {
            // render function
            // @ts-ignore
            options.render = setupResult;
        }
        else if (isObject(setupResult)) {
            // bindings
            if (setupResult instanceof VNode) {
                warn(`setup() should not return VNodes directly - ` +
                    `return a render function instead.`);
            }
            vm._setupState = setupResult;
            // __sfc indicates compiled bindings from <script setup>
            if (!setupResult.__sfc) {
                for (const key in setupResult) {
                    if (!isReserved(key)) {
                        proxyWithRefUnwrap(vm, setupResult, key);
                    }
                    else {
                        warn(`Avoid using variables that start with _ or $ in setup().`);
                    }
                }
            }
            else {
                // exposed for compiled render fn
                const proxy = (vm._setupProxy = {});
                for (const key in setupResult) {
                    if (key !== '__sfc') {
                        proxyWithRefUnwrap(proxy, setupResult, key);
                    }
                }
            }
        }
        else if (setupResult !== undefined) {
            warn(`setup() should return an object. Received: ${setupResult === null ? 'null' : typeof setupResult}`);
        }
    }
}
function createSetupContext(vm) {
    let exposeCalled = false;
    return {
        get attrs() {
            if (!vm._attrsProxy) {
                const proxy = (vm._attrsProxy = {});
                def(proxy, '_v_attr_proxy', true);
                syncSetupProxy(proxy, vm.$attrs, emptyObject, vm, '$attrs');
            }
            return vm._attrsProxy;
        },
        get listeners() {
            if (!vm._listenersProxy) {
                const proxy = (vm._listenersProxy = {});
                syncSetupProxy(proxy, vm.$listeners, emptyObject, vm, '$listeners');
            }
            return vm._listenersProxy;
        },
        get slots() {
            return initSlotsProxy(vm);
        },
        emit: bind(vm.$emit, vm),
        expose(exposed) {
            {
                if (exposeCalled) {
                    warn(`expose() should be called only once per setup().`, vm);
                }
                exposeCalled = true;
            }
            if (exposed) {
                Object.keys(exposed).forEach(key => proxyWithRefUnwrap(vm, exposed, key));
            }
        }
    };
}
function syncSetupProxy(to, from, prev, instance, type) {
    let changed = false;
    for (const key in from) {
        if (!(key in to)) {
            changed = true;
            defineProxyAttr(to, key, instance, type);
        }
        else if (from[key] !== prev[key]) {
            changed = true;
        }
    }
    for (const key in to) {
        if (!(key in from)) {
            changed = true;
            delete to[key];
        }
    }
    return changed;
}
function defineProxyAttr(proxy, key, instance, type) {
    Object.defineProperty(proxy, key, {
        enumerable: true,
        configurable: true,
        get() {
            return instance[type][key];
        }
    });
}
function initSlotsProxy(vm) {
    if (!vm._slotsProxy) {
        syncSetupSlots((vm._slotsProxy = {}), vm.$scopedSlots);
    }
    return vm._slotsProxy;
}
function syncSetupSlots(to, from) {
    for (const key in from) {
        to[key] = from[key];
    }
    for (const key in to) {
        if (!(key in from)) {
            delete to[key];
        }
    }
}
/**
 * @internal use manual type def because public setup context type relies on
 * legacy VNode types
 */
function useSlots() {
    return getContext().slots;
}
/**
 * @internal use manual type def because public setup context type relies on
 * legacy VNode types
 */
function useAttrs() {
    return getContext().attrs;
}
/**
 * Vue 2 only
 * @internal use manual type def because public setup context type relies on
 * legacy VNode types
 */
function useListeners() {
    return getContext().listeners;
}
function getContext() {
    if (!currentInstance) {
        warn(`useContext() called without active instance.`);
    }
    const vm = currentInstance;
    return vm._setupContext || (vm._setupContext = createSetupContext(vm));
}
/**
 * Runtime helper for merging default declarations. Imported by compiled code
 * only.
 * @internal
 */
function mergeDefaults(raw, defaults) {
    const props = isArray(raw)
        ? raw.reduce((normalized, p) => ((normalized[p] = {}), normalized), {})
        : raw;
    for (const key in defaults) {
        const opt = props[key];
        if (opt) {
            if (isArray(opt) || isFunction(opt)) {
                props[key] = { type: opt, default: defaults[key] };
            }
            else {
                opt.default = defaults[key];
            }
        }
        else if (opt === null) {
            props[key] = { default: defaults[key] };
        }
        else {
            warn(`props default key "${key}" has no corresponding declaration.`);
        }
    }
    return props;
}

export { initSetup, mergeDefaults, syncSetupProxy, syncSetupSlots, useAttrs, useListeners, useSlots };
