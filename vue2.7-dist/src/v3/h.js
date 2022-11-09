import { createElement } from '../core/vdom/create-element.js';
import { currentInstance } from './currentInstance.js';
import '../shared/util.js';
import '../core/util/env.js';
import '../core/util/options.js';
import { warn } from '../core/util/debug.js';
import '../core/observer/dep.js';
import '../core/observer/array.js';
import '../core/observer/traverse.js';
import '../core/observer/scheduler.js';
import '../core/util/next-tick.js';

/**
 * @internal this function needs manual public type declaration because it relies
 * on previously manually authored types from Vue 2
 */
function h(type, props, children) {
    if (!currentInstance) {
        warn(`globally imported h() can only be invoked when there is an active ` +
                `component instance, e.g. synchronously in a component's render or setup function.`);
    }
    return createElement(currentInstance, type, props, children, 2, true);
}

export { h };
