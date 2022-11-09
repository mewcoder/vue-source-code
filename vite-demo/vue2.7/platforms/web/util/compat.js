/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import '../../../shared/util.js';
import { inBrowser } from '../../../core/util/env.js';
import '../../../core/util/options.js';
import '../../../core/util/debug.js';
import '../../../core/observer/index.js';
import '../../../core/observer/dep.js';
import '../../../core/util/next-tick.js';

// check whether current browser encodes a char inside attribute values
var div;
function getShouldDecode(href) {
    div = div || document.createElement('div');
    div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
    return div.innerHTML.indexOf('&#10;') > 0;
}
// #3663: IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
// #6828: chrome encodes content in a[href]
var shouldDecodeNewlinesForHref = inBrowser
    ? getShouldDecode(true)
    : false;

export { shouldDecodeNewlines, shouldDecodeNewlinesForHref };
