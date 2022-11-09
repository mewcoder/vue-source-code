/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import { isArray, isDef } from '../../../shared/util.js';
import { isAsyncPlaceholder } from './is-async-placeholder.js';

function getFirstComponentChild(children) {
    if (isArray(children)) {
        for (var i = 0; i < children.length; i++) {
            var c = children[i];
            if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
                return c;
            }
        }
    }
}

export { getFirstComponentChild };
