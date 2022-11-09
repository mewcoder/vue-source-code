/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import { isPrimitive, extend, camelize } from '../../../../shared/util.js';
import '../../../../core/util/env.js';
import '../../../../core/util/options.js';
import { warn } from '../../../../core/util/debug.js';
import '../../../../core/observer/index.js';
import '../../../../core/observer/dep.js';
import '../../../../core/util/next-tick.js';
import { mergeVNodeHook } from '../../../../core/vdom/helpers/merge-hook.js';
import '../../../../core/vdom/vnode.js';
import '../../../../core/instance/proxy.js';
import '../../../../core/observer/watcher.js';
import '../../../../core/util/perf.js';
import '../../../../core/observer/traverse.js';
import '../../../../core/observer/scheduler.js';
import '../../../../v3/reactivity/effectScope.js';
import '../../../../core/vdom/create-functional-component.js';
import { isAsyncPlaceholder } from '../../../../core/vdom/helpers/is-async-placeholder.js';
import { getFirstComponentChild } from '../../../../core/vdom/helpers/get-first-component-child.js';

// Provides transition support for a single element/component.
var transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterToClass: String,
    leaveToClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
    appearToClass: String,
    duration: [Number, String, Object]
};
// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild(vnode) {
    var compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
        return getRealChild(getFirstComponentChild(compOptions.children));
    }
    else {
        return vnode;
    }
}
function extractTransitionData(comp) {
    var data = {};
    var options = comp.$options;
    // props
    for (var key in options.propsData) {
        data[key] = comp[key];
    }
    // events.
    // extract listeners and pass them directly to the transition methods
    var listeners = options._parentListeners;
    for (var key in listeners) {
        data[camelize(key)] = listeners[key];
    }
    return data;
}
function placeholder(h, rawChild) {
    // @ts-expect-error
    if (/\d-keep-alive$/.test(rawChild.tag)) {
        return h('keep-alive', {
            props: rawChild.componentOptions.propsData
        });
    }
}
function hasParentTransition(vnode) {
    while ((vnode = vnode.parent)) {
        if (vnode.data.transition) {
            return true;
        }
    }
}
function isSameChild(child, oldChild) {
    return oldChild.key === child.key && oldChild.tag === child.tag;
}
var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };
var isVShowDirective = function (d) { return d.name === 'show'; };
var Transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,
    render: function (h) {
        var _this = this;
        var children = this.$slots.default;
        if (!children) {
            return;
        }
        // filter out text nodes (possible whitespaces)
        children = children.filter(isNotTextNode);
        /* istanbul ignore if */
        if (!children.length) {
            return;
        }
        // warn multiple elements
        if (children.length > 1) {
            warn('<transition> can only be used on a single element. Use ' +
                '<transition-group> for lists.', this.$parent);
        }
        var mode = this.mode;
        // warn invalid mode
        if (mode && mode !== 'in-out' && mode !== 'out-in') {
            warn('invalid <transition> mode: ' + mode, this.$parent);
        }
        var rawChild = children[0];
        // if this is a component root node and the component's
        // parent container node also has transition, skip.
        if (hasParentTransition(this.$vnode)) {
            return rawChild;
        }
        // apply transition data to child
        // use getRealChild() to ignore abstract components e.g. keep-alive
        var child = getRealChild(rawChild);
        /* istanbul ignore if */
        if (!child) {
            return rawChild;
        }
        if (this._leaving) {
            return placeholder(h, rawChild);
        }
        // ensure a key that is unique to the vnode type and to this transition
        // component instance. This key will be used to remove pending leaving nodes
        // during entering.
        var id = "__transition-".concat(this._uid, "-");
        child.key =
            child.key == null
                ? child.isComment
                    ? id + 'comment'
                    : id + child.tag
                : isPrimitive(child.key)
                    ? String(child.key).indexOf(id) === 0
                        ? child.key
                        : id + child.key
                    : child.key;
        var data = ((child.data || (child.data = {})).transition =
            extractTransitionData(this));
        var oldRawChild = this._vnode;
        var oldChild = getRealChild(oldRawChild);
        // mark v-show
        // so that the transition module can hand over the control to the directive
        if (child.data.directives && child.data.directives.some(isVShowDirective)) {
            child.data.show = true;
        }
        if (oldChild &&
            oldChild.data &&
            !isSameChild(child, oldChild) &&
            !isAsyncPlaceholder(oldChild) &&
            // #6687 component root is a comment node
            !(oldChild.componentInstance &&
                oldChild.componentInstance._vnode.isComment)) {
            // replace old child transition data with fresh one
            // important for dynamic transitions!
            var oldData = (oldChild.data.transition = extend({}, data));
            // handle transition mode
            if (mode === 'out-in') {
                // return placeholder node and queue update when leave finishes
                this._leaving = true;
                mergeVNodeHook(oldData, 'afterLeave', function () {
                    _this._leaving = false;
                    _this.$forceUpdate();
                });
                return placeholder(h, rawChild);
            }
            else if (mode === 'in-out') {
                if (isAsyncPlaceholder(child)) {
                    return oldRawChild;
                }
                var delayedLeave_1;
                var performLeave = function () {
                    delayedLeave_1();
                };
                mergeVNodeHook(data, 'afterEnter', performLeave);
                mergeVNodeHook(data, 'enterCancelled', performLeave);
                mergeVNodeHook(oldData, 'delayLeave', function (leave) {
                    delayedLeave_1 = leave;
                });
            }
        }
        return rawChild;
    }
};

export { Transition as default, extractTransitionData, transitionProps };
