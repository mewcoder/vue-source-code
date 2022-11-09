import { defineReactive } from '../../core/observer/index.js';
import { isReactive } from './reactive.js';
import Dep from '../../core/observer/dep.js';
import { isArray } from '../../shared/util.js';
import { def } from '../../core/util/lang.js';
import { isServerRendering } from '../../core/util/env.js';
import '../../core/util/options.js';
import { warn } from '../../core/util/debug.js';
import '../../core/util/next-tick.js';

/**
 * @internal
 */
const RefFlag = `__v_isRef`;
function isRef(r) {
    return !!(r && r.__v_isRef === true);
}
function ref(value) {
    return createRef(value, false);
}
function shallowRef(value) {
    return createRef(value, true);
}
function createRef(rawValue, shallow) {
    if (isRef(rawValue)) {
        return rawValue;
    }
    const ref = {};
    def(ref, RefFlag, true);
    def(ref, "__v_isShallow" /* ReactiveFlags.IS_SHALLOW */, shallow);
    def(ref, 'dep', defineReactive(ref, 'value', rawValue, null, shallow, isServerRendering()));
    return ref;
}
function triggerRef(ref) {
    if (!ref.dep) {
        warn(`received object is not a triggerable ref.`);
    }
    {
        ref.dep &&
            ref.dep.notify({
                type: "set" /* TriggerOpTypes.SET */,
                target: ref,
                key: 'value'
            });
    }
}
function unref(ref) {
    return isRef(ref) ? ref.value : ref;
}
function proxyRefs(objectWithRefs) {
    if (isReactive(objectWithRefs)) {
        return objectWithRefs;
    }
    const proxy = {};
    const keys = Object.keys(objectWithRefs);
    for (let i = 0; i < keys.length; i++) {
        proxyWithRefUnwrap(proxy, objectWithRefs, keys[i]);
    }
    return proxy;
}
function proxyWithRefUnwrap(target, source, key) {
    Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get: () => {
            const val = source[key];
            if (isRef(val)) {
                return val.value;
            }
            else {
                const ob = val && val.__ob__;
                if (ob)
                    ob.dep.depend();
                return val;
            }
        },
        set: value => {
            const oldValue = source[key];
            if (isRef(oldValue) && !isRef(value)) {
                oldValue.value = value;
            }
            else {
                source[key] = value;
            }
        }
    });
}
function customRef(factory) {
    const dep = new Dep();
    const { get, set } = factory(() => {
        {
            dep.depend({
                target: ref,
                type: "get" /* TrackOpTypes.GET */,
                key: 'value'
            });
        }
    }, () => {
        {
            dep.notify({
                target: ref,
                type: "set" /* TriggerOpTypes.SET */,
                key: 'value'
            });
        }
    });
    const ref = {
        get value() {
            return get();
        },
        set value(newVal) {
            set(newVal);
        }
    };
    def(ref, RefFlag, true);
    return ref;
}
function toRefs(object) {
    if (!isReactive(object)) {
        warn(`toRefs() expects a reactive object but received a plain one.`);
    }
    const ret = isArray(object) ? new Array(object.length) : {};
    for (const key in object) {
        ret[key] = toRef(object, key);
    }
    return ret;
}
function toRef(object, key, defaultValue) {
    const val = object[key];
    if (isRef(val)) {
        return val;
    }
    const ref = {
        get value() {
            const val = object[key];
            return val === undefined ? defaultValue : val;
        },
        set value(newVal) {
            object[key] = newVal;
        }
    };
    def(ref, RefFlag, true);
    return ref;
}

export { RefFlag, customRef, isRef, proxyRefs, proxyWithRefUnwrap, ref, shallowRef, toRef, toRefs, triggerRef, unref };
