import '../../shared/util.js';
import '../util/env.js';
import '../util/options.js';
import '../util/debug.js';
import '../observer/dep.js';
import '../observer/array.js';
import '../observer/traverse.js';
import '../observer/scheduler.js';
import '../config.js';
import './proxy.js';
import '../util/perf.js';
import { updateListeners } from '../vdom/helpers/update-listeners.js';
import '../vdom/create-functional-component.js';
import '../util/next-tick.js';

let target;
function add(event, fn) {
    target.$on(event, fn);
}
function remove(event, fn) {
    target.$off(event, fn);
}
function createOnceHandler(event, fn) {
    const _target = target;
    return function onceHandler() {
        const res = fn.apply(null, arguments);
        if (res !== null) {
            _target.$off(event, onceHandler);
        }
    };
}
function updateComponentListeners(vm, listeners, oldListeners) {
    target = vm;
    updateListeners(listeners, oldListeners || {}, add, remove, createOnceHandler, vm);
    target = undefined;
}

export { updateComponentListeners };
