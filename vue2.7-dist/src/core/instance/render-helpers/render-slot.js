import { isObject, extend, isFunction } from '../../../shared/util.js';
import '../../util/env.js';
import '../../util/options.js';
import { warn } from '../../util/debug.js';
import '../../observer/dep.js';
import '../../observer/array.js';
import '../../observer/traverse.js';
import '../../observer/scheduler.js';
import '../../config.js';
import '../proxy.js';
import '../../util/perf.js';
import '../../vdom/create-functional-component.js';
import '../../util/next-tick.js';

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot(name, fallbackRender, props, bindObject) {
    const scopedSlotFn = this.$scopedSlots[name];
    let nodes;
    if (scopedSlotFn) {
        // scoped slot
        props = props || {};
        if (bindObject) {
            if (process.env.NODE_ENV !== 'production' && !isObject(bindObject)) {
                warn('slot v-bind without argument expects an Object', this);
            }
            props = extend(extend({}, bindObject), props);
        }
        nodes =
            scopedSlotFn(props) ||
                (isFunction(fallbackRender) ? fallbackRender() : fallbackRender);
    }
    else {
        nodes =
            this.$slots[name] ||
                (isFunction(fallbackRender) ? fallbackRender() : fallbackRender);
    }
    const target = props && props.slot;
    if (target) {
        return this.$createElement('template', { slot: target }, nodes);
    }
    else {
        return nodes;
    }
}

export { renderSlot };
