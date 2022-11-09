/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import { remove, extend, cached } from '../../../shared/util.js';
import { inBrowser, isIE9 } from '../../../core/util/env.js';
import '../../../core/util/options.js';
import '../../../core/util/debug.js';
import '../../../core/observer/index.js';
import '../../../core/observer/dep.js';
import '../../../core/util/next-tick.js';
import { addClass, removeClass } from './class-util.js';

function resolveTransition(def) {
    if (!def) {
        return;
    }
    /* istanbul ignore else */
    if (typeof def === 'object') {
        var res = {};
        if (def.css !== false) {
            extend(res, autoCssTransition(def.name || 'v'));
        }
        extend(res, def);
        return res;
    }
    else if (typeof def === 'string') {
        return autoCssTransition(def);
    }
}
var autoCssTransition = cached(function (name) {
    return {
        enterClass: "".concat(name, "-enter"),
        enterToClass: "".concat(name, "-enter-to"),
        enterActiveClass: "".concat(name, "-enter-active"),
        leaveClass: "".concat(name, "-leave"),
        leaveToClass: "".concat(name, "-leave-to"),
        leaveActiveClass: "".concat(name, "-leave-active")
    };
});
var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';
// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
    /* istanbul ignore if */
    if (window.ontransitionend === undefined &&
        window.onwebkittransitionend !== undefined) {
        transitionProp = 'WebkitTransition';
        transitionEndEvent = 'webkitTransitionEnd';
    }
    if (window.onanimationend === undefined &&
        window.onwebkitanimationend !== undefined) {
        animationProp = 'WebkitAnimation';
        animationEndEvent = 'webkitAnimationEnd';
    }
}
// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
    ? window.requestAnimationFrame
        ? window.requestAnimationFrame.bind(window)
        : setTimeout
    : /* istanbul ignore next */ function (/* istanbul ignore next */ fn) { return fn(); };
function nextFrame(fn) {
    raf(function () {
        // @ts-expect-error
        raf(fn);
    });
}
function addTransitionClass(el, cls) {
    var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
    if (transitionClasses.indexOf(cls) < 0) {
        transitionClasses.push(cls);
        addClass(el, cls);
    }
}
function removeTransitionClass(el, cls) {
    if (el._transitionClasses) {
        remove(el._transitionClasses, cls);
    }
    removeClass(el, cls);
}
function whenTransitionEnds(el, expectedType, cb) {
    var _a = getTransitionInfo(el, expectedType), type = _a.type, timeout = _a.timeout, propCount = _a.propCount;
    if (!type)
        return cb();
    var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
    var ended = 0;
    var end = function () {
        el.removeEventListener(event, onEnd);
        cb();
    };
    var onEnd = function (e) {
        if (e.target === el) {
            if (++ended >= propCount) {
                end();
            }
        }
    };
    setTimeout(function () {
        if (ended < propCount) {
            end();
        }
    }, timeout + 1);
    el.addEventListener(event, onEnd);
}
var transformRE = /\b(transform|all)(,|$)/;
function getTransitionInfo(el, expectedType) {
    var styles = window.getComputedStyle(el);
    // JSDOM may return undefined for transition properties
    var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
    var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
    var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
    var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
    var animationTimeout = getTimeout(animationDelays, animationDurations);
    var type;
    var timeout = 0;
    var propCount = 0;
    /* istanbul ignore if */
    if (expectedType === TRANSITION) {
        if (transitionTimeout > 0) {
            type = TRANSITION;
            timeout = transitionTimeout;
            propCount = transitionDurations.length;
        }
    }
    else if (expectedType === ANIMATION) {
        if (animationTimeout > 0) {
            type = ANIMATION;
            timeout = animationTimeout;
            propCount = animationDurations.length;
        }
    }
    else {
        timeout = Math.max(transitionTimeout, animationTimeout);
        type =
            timeout > 0
                ? transitionTimeout > animationTimeout
                    ? TRANSITION
                    : ANIMATION
                : null;
        propCount = type
            ? type === TRANSITION
                ? transitionDurations.length
                : animationDurations.length
            : 0;
    }
    var hasTransform = type === TRANSITION && transformRE.test(styles[transitionProp + 'Property']);
    return {
        type: type,
        timeout: timeout,
        propCount: propCount,
        hasTransform: hasTransform
    };
}
function getTimeout(delays, durations) {
    /* istanbul ignore next */
    while (delays.length < durations.length) {
        delays = delays.concat(delays);
    }
    return Math.max.apply(null, durations.map(function (d, i) {
        return toMs(d) + toMs(delays[i]);
    }));
}
// Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
// in a locale-dependent way, using a comma instead of a dot.
// If comma is not replaced with a dot, the input will be rounded down (i.e. acting
// as a floor function) causing unexpected behaviors
function toMs(s) {
    return Number(s.slice(0, -1).replace(',', '.')) * 1000;
}

export { addTransitionClass, animationEndEvent, animationProp, getTransitionInfo, hasTransition, nextFrame, removeTransitionClass, resolveTransition, transitionEndEvent, transitionProp, whenTransitionEnds };
