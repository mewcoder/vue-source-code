import { emptyObject } from '../../shared/util.js';
import '../../core/util/env.js';
import '../../core/util/options.js';
import { warn } from '../../core/util/debug.js';
import '../../core/observer/dep.js';
import '../../core/observer/array.js';
import '../../core/observer/traverse.js';
import '../../core/observer/scheduler.js';
import { currentInstance } from '../currentInstance.js';
import '../../core/instance/proxy.js';
import '../../core/util/perf.js';
import '../../core/vdom/create-functional-component.js';
import '../../core/util/next-tick.js';

function useCssModule(name = '$style') {
    /* istanbul ignore else */
    {
        if (!currentInstance) {
            warn(`useCssModule must be called inside setup()`);
            return emptyObject;
        }
        const mod = currentInstance[name];
        if (!mod) {
            warn(`Current instance does not have CSS module named "${name}".`);
            return emptyObject;
        }
        return mod;
    }
}

export { useCssModule };
