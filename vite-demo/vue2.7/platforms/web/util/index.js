/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import '../../../shared/util.js';
import '../../../core/util/env.js';
import '../../../core/util/options.js';
import { warn } from '../../../core/util/debug.js';
import '../../../core/observer/index.js';
import '../../../core/observer/dep.js';
import '../../../core/util/next-tick.js';
export { convertEnumeratedValue, getXlinkProp, isBooleanAttr, isEnumeratedAttr, isFalsyAttrValue, isReservedAttr, isXlink, mustUseProp, xlinkNS } from './attrs.js';
export { getTagNamespace, isHTMLTag, isPreTag, isReservedTag, isSVG, isTextInputType, isUnknownElement, namespaceMap } from './element.js';

/**
 * Query an element selector if it's not an element already.
 */
function query(el) {
    if (typeof el === 'string') {
        var selected = document.querySelector(el);
        if (!selected) {
            warn('Cannot find element: ' + el);
            return document.createElement('div');
        }
        return selected;
    }
    else {
        return el;
    }
}

export { query };
