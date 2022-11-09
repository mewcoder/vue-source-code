import Watcher from '../../core/observer/watcher.js';
import { noop } from '../../shared/util.js';
import { currentInstance } from '../currentInstance.js';

// export type EffectScheduler = (...args: any[]) => any
/**
 * @internal since we are not exposing this in Vue 2, it's used only for
 * internal testing.
 */
function effect(fn, scheduler) {
    const watcher = new Watcher(currentInstance, fn, noop, {
        sync: true
    });
    if (scheduler) {
        watcher.update = () => {
            scheduler(() => watcher.run());
        };
    }
}

export { effect };
