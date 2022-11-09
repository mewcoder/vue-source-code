/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import { isObject, isArray } from '../../shared/util.js';
import { _Set } from '../util/env.js';
import '../util/options.js';
import '../util/debug.js';
import './index.js';
import './dep.js';
import '../util/next-tick.js';
import VNode from '../vdom/vnode.js';
import { isRef } from '../../v3/reactivity/ref.js';
import './watcher.js';
import './scheduler.js';
import '../../v3/reactivity/effectScope.js';
import '../instance/proxy.js';
import '../util/perf.js';
import '../vdom/create-functional-component.js';

var seenObjects = new _Set();
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
    var i, keys;
    var isA = isArray(val);
    if ((!isA && !isObject(val)) ||
        val.__v_skip /* ReactiveFlags.SKIP */ ||
        Object.isFrozen(val) ||
        val instanceof VNode) {
        return;
    }
    if (val.__ob__) {
        var depId = val.__ob__.dep.id;
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
