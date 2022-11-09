/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import { warn } from '../../util/debug.js';

// helper to process dynamic keys for dynamic arguments in v-bind and v-on.
function bindDynamicKeys(baseObj, values) {
    for (var i = 0; i < values.length; i += 2) {
        var key = values[i];
        if (typeof key === 'string' && key) {
            baseObj[values[i]] = values[i + 1];
        }
        else if (key !== '' && key !== null) {
            // null is a special value for explicitly removing a binding
            warn("Invalid value for dynamic directive argument (expected string or null): ".concat(key), this);
        }
    }
    return baseObj;
}
// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier(value, symbol) {
    return typeof value === 'string' ? symbol + value : value;
}

export { bindDynamicKeys, prependModifier };
