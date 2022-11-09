import { isPlainObject, isArray } from '../../shared/util.js';
import { def } from '../../core/util/lang.js';
import '../../core/util/env.js';
import '../../core/util/options.js';
import { warn } from '../../core/util/debug.js';
import '../../core/observer/dep.js';
import '../../core/observer/array.js';
import { isRef, RefFlag } from './ref.js';
import { isCollectionType, isReadonly, isShallow } from './reactive.js';
import '../../core/observer/traverse.js';
import '../../core/observer/scheduler.js';
import '../../core/instance/proxy.js';
import '../../core/util/perf.js';
import '../../core/vdom/create-functional-component.js';
import '../../core/util/next-tick.js';

const rawToReadonlyMap = new WeakMap();
const rawToShallowReadonlyMap = new WeakMap();
function readonly(target) {
    return createReadonly(target, false);
}
function createReadonly(target, shallow) {
    if (!isPlainObject(target)) {
        {
            if (isArray(target)) {
                warn(`Vue 2 does not support readonly arrays.`);
            }
            else if (isCollectionType(target)) {
                warn(`Vue 2 does not support readonly collection types such as Map or Set.`);
            }
            else {
                warn(`value cannot be made readonly: ${typeof target}`);
            }
        }
        return target;
    }
    // already a readonly object
    if (isReadonly(target)) {
        return target;
    }
    // already has a readonly proxy
    const map = shallow ? rawToShallowReadonlyMap : rawToReadonlyMap;
    const existingProxy = map.get(target);
    if (existingProxy) {
        return existingProxy;
    }
    const proxy = Object.create(Object.getPrototypeOf(target));
    map.set(target, proxy);
    def(proxy, "__v_isReadonly" /* ReactiveFlags.IS_READONLY */, true);
    def(proxy, "__v_raw" /* ReactiveFlags.RAW */, target);
    if (isRef(target)) {
        def(proxy, RefFlag, true);
    }
    if (shallow || isShallow(target)) {
        def(proxy, "__v_isShallow" /* ReactiveFlags.IS_SHALLOW */, true);
    }
    const keys = Object.keys(target);
    for (let i = 0; i < keys.length; i++) {
        defineReadonlyProperty(proxy, target, keys[i], shallow);
    }
    return proxy;
}
function defineReadonlyProperty(proxy, target, key, shallow) {
    Object.defineProperty(proxy, key, {
        enumerable: true,
        configurable: true,
        get() {
            const val = target[key];
            return shallow || !isPlainObject(val) ? val : readonly(val);
        },
        set() {
            warn(`Set operation on key "${key}" failed: target is readonly.`);
        }
    });
}
/**
 * Returns a reactive-copy of the original object, where only the root level
 * properties are readonly, and does NOT unwrap refs nor recursively convert
 * returned properties.
 * This is used for creating the props proxy object for stateful components.
 */
function shallowReadonly(target) {
    return createReadonly(target, true);
}

export { readonly, shallowReadonly };
