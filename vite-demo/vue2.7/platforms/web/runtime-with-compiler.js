/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import config from '../../core/config.js';
import { cached } from '../../shared/util.js';
import '../../core/util/env.js';
import '../../core/util/options.js';
import { warn } from '../../core/util/debug.js';
import '../../core/observer/index.js';
import '../../core/observer/dep.js';
import '../../core/util/next-tick.js';
import { mark, measure } from '../../core/util/perf.js';
import './runtime/index.js';
import { query } from './util/index.js';
import { compileToFunctions } from './compiler/index.js';
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat.js';
import '../../core/index.js';
import Vue from '../../core/instance/index.js';
export { default } from '../../core/instance/index.js';

var idToTemplate = cached(function (id) {
    var el = query(id);
    return el && el.innerHTML;
});
var mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (el, hydrating) {
    el = el && query(el);
    /* istanbul ignore if */
    if (el === document.body || el === document.documentElement) {
        warn("Do not mount Vue to <html> or <body> - mount to normal elements instead.");
        return this;
    }
    var options = this.$options;
    // resolve template/el and convert to render function
    if (!options.render) {
        var template = options.template;
        if (template) {
            if (typeof template === 'string') {
                if (template.charAt(0) === '#') {
                    template = idToTemplate(template);
                    /* istanbul ignore if */
                    if (!template) {
                        warn("Template element not found or is empty: ".concat(options.template), this);
                    }
                }
            }
            else if (template.nodeType) {
                template = template.innerHTML;
            }
            else {
                {
                    warn('invalid template option:' + template, this);
                }
                return this;
            }
        }
        else if (el) {
            // @ts-expect-error
            template = getOuterHTML(el);
        }
        if (template) {
            /* istanbul ignore if */
            if (config.performance && mark) {
                mark('compile');
            }
            var _a = compileToFunctions(template, {
                outputSourceRange: true,
                shouldDecodeNewlines: shouldDecodeNewlines,
                shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
                delimiters: options.delimiters,
                comments: options.comments
            }, this), render = _a.render, staticRenderFns = _a.staticRenderFns;
            options.render = render;
            options.staticRenderFns = staticRenderFns;
            /* istanbul ignore if */
            if (config.performance && mark) {
                mark('compile end');
                measure("vue ".concat(this._name, " compile"), 'compile', 'compile end');
            }
        }
    }
    return mount.call(this, el, hydrating);
};
/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML(el) {
    if (el.outerHTML) {
        return el.outerHTML;
    }
    else {
        var container = document.createElement('div');
        container.appendChild(el.cloneNode(true));
        return container.innerHTML;
    }
}
Vue.compile = compileToFunctions;
