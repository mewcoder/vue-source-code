import { ASSET_TYPES } from '../../shared/constants.js';
import { isPlainObject, isFunction } from '../../shared/util.js';
import '../util/env.js';
import { validateComponentName } from '../util/options.js';
import '../util/debug.js';
import '../observer/dep.js';
import '../observer/array.js';
import '../observer/traverse.js';
import '../observer/scheduler.js';
import '../instance/proxy.js';
import '../util/perf.js';
import '../vdom/create-functional-component.js';
import '../util/next-tick.js';

function initAssetRegisters(Vue) {
    /**
     * Create asset registration methods.
     */
    ASSET_TYPES.forEach(type => {
        // @ts-expect-error function is not exact same type
        Vue[type] = function (id, definition) {
            if (!definition) {
                return this.options[type + 's'][id];
            }
            else {
                /* istanbul ignore if */
                if (type === 'component') {
                    validateComponentName(id);
                }
                if (type === 'component' && isPlainObject(definition)) {
                    // @ts-expect-error
                    definition.name = definition.name || id;
                    definition = this.options._base.extend(definition);
                }
                if (type === 'directive' && isFunction(definition)) {
                    definition = { bind: definition, update: definition };
                }
                this.options[type + 's'][id] = definition;
                return definition;
            }
        };
    });
}

export { initAssetRegisters };
