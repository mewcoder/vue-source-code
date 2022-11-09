import { noop, isFunction } from '../../shared/util.js';
import { def } from '../../core/util/lang.js';
import { isServerRendering } from '../../core/util/env.js';
import '../../core/util/options.js';
import { warn } from '../../core/util/debug.js';
import Dep from '../../core/observer/dep.js';
import '../../core/observer/array.js';
import { RefFlag } from './ref.js';
import Watcher from '../../core/observer/watcher.js';
import { currentInstance } from '../currentInstance.js';
import '../../core/observer/traverse.js';
import '../../core/observer/scheduler.js';
import '../../core/instance/proxy.js';
import '../../core/util/perf.js';
import '../../core/vdom/create-functional-component.js';
import '../../core/util/next-tick.js';

function computed(getterOrOptions, debugOptions) {
    let getter;
    let setter;
    const onlyGetter = isFunction(getterOrOptions);
    if (onlyGetter) {
        getter = getterOrOptions;
        setter = () => {
                warn('Write operation failed: computed value is readonly');
            }
            ;
    }
    else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    const watcher = isServerRendering()
        ? null
        : new Watcher(currentInstance, getter, noop, { lazy: true });
    if (watcher && debugOptions) {
        watcher.onTrack = debugOptions.onTrack;
        watcher.onTrigger = debugOptions.onTrigger;
    }
    const ref = {
        // some libs rely on the presence effect for checking computed refs
        // from normal refs, but the implementation doesn't matter
        effect: watcher,
        get value() {
            if (watcher) {
                if (watcher.dirty) {
                    watcher.evaluate();
                }
                if (Dep.target) {
                    if (Dep.target.onTrack) {
                        Dep.target.onTrack({
                            effect: Dep.target,
                            target: ref,
                            type: "get" /* TrackOpTypes.GET */,
                            key: 'value'
                        });
                    }
                    watcher.depend();
                }
                return watcher.value;
            }
            else {
                return getter();
            }
        },
        set value(newVal) {
            setter(newVal);
        }
    };
    def(ref, RefFlag, true);
    def(ref, "__v_isReadonly" /* ReactiveFlags.IS_READONLY */, onlyGetter);
    return ref;
}

export { computed };
