import { isFunction } from '../../shared/util.js';
import { hasSymbol } from '../util/env.js';
import '../util/options.js';
import { warn } from '../util/debug.js';
import '../observer/dep.js';
import '../observer/array.js';
import '../observer/traverse.js';
import '../observer/scheduler.js';
import '../config.js';
import './proxy.js';
import '../util/perf.js';
import '../vdom/create-functional-component.js';
import '../util/next-tick.js';

function resolveInject(inject, vm) {
    if (inject) {
        // inject is :any because flow is not smart enough to figure out cached
        const result = Object.create(null);
        const keys = hasSymbol ? Reflect.ownKeys(inject) : Object.keys(inject);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            // #6574 in case the inject object is observed...
            if (key === '__ob__')
                continue;
            const provideKey = inject[key].from;
            if (provideKey in vm._provided) {
                result[key] = vm._provided[provideKey];
            }
            else if ('default' in inject[key]) {
                const provideDefault = inject[key].default;
                result[key] = isFunction(provideDefault)
                    ? provideDefault.call(vm)
                    : provideDefault;
            }
            else if (process.env.NODE_ENV !== 'production') {
                warn(`Injection "${key}" not found`, vm);
            }
        }
        return result;
    }
}

export { resolveInject };
