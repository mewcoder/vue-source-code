import '../../core/observer/dep.js';
import '../../core/observer/array.js';
import '../../shared/util.js';
import { inBrowser } from '../../core/util/env.js';
import '../../core/util/options.js';
import { warn } from '../../core/util/debug.js';
import '../../core/util/next-tick.js';
import '../../core/observer/traverse.js';
import '../../core/observer/scheduler.js';
import { currentInstance } from '../currentInstance.js';
import { watchPostEffect } from '../apiWatch.js';
import '../../core/instance/proxy.js';
import '../../core/util/perf.js';
import '../../core/vdom/create-functional-component.js';

/**
 * Runtime helper for SFC's CSS variable injection feature.
 * @private
 */
function useCssVars(getter) {
    if (!inBrowser && !false)
        return;
    const instance = currentInstance;
    if (!instance) {
        warn(`useCssVars is called without current active component instance.`);
        return;
    }
    watchPostEffect(() => {
        const el = instance.$el;
        const vars = getter(instance, instance._setupProxy);
        if (el && el.nodeType === 1) {
            const style = el.style;
            for (const key in vars) {
                style.setProperty(`--${key}`, vars[key]);
            }
        }
    });
}

export { useCssVars };
