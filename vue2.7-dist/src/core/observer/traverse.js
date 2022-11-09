import { isObject, isArray } from '../../shared/util.js';
import { _Set } from '../util/env.js';
import '../util/options.js';
import '../util/debug.js';
import './dep.js';
import VNode from '../vdom/vnode.js';
import './array.js';
import { isRef } from '../../v3/reactivity/ref.js';
import './scheduler.js';
import '../instance/proxy.js';
import '../util/perf.js';
import '../vdom/create-functional-component.js';
import '../util/next-tick.js';

const seenObjects = new _Set();
/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse(val) {
    _traverse(val, seenObjects);
    seenObjects.clear();
    return val;
}
function _traverse(val, seen) {
    let i, keys;
    const isA = isArray(val);
    if ((!isA && !isObject(val)) ||
        val.__v_skip /* ReactiveFlags.SKIP */ ||
        Object.isFrozen(val) ||
        val instanceof VNode) {
        return;
    }
    if (val.__ob__) {
        const depId = val.__ob__.dep.id;
        if (seen.has(depId)) {
            return;
        }
        seen.add(depId);
    }
    if (isA) {
        i = val.length;
        while (i--)
            _traverse(val[i], seen);
    }
    else if (isRef(val)) {
        _traverse(val.value, seen);
    }
    else {
        keys = Object.keys(val);
        i = keys.length;
        while (i--)
            _traverse(val[keys[i]], seen);
    }
}

export { traverse };
