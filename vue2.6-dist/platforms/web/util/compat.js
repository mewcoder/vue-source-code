import '../../../shared/util.js';
import { inBrowser } from '../../../core/util/env.js';
import '../../../core/util/options.js';
import '../../../core/util/debug.js';
import '../../../core/observer/dep.js';
import '../../../core/observer/array.js';
import '../../../core/util/next-tick.js';

/*  */

// check whether current browser encodes a char inside attribute values
let div;
function getShouldDecode (href) {
  div = div || document.createElement('div');
  div.innerHTML = href ? `<a href="\n"/>` : `<div a="\n"/>`;
  return div.innerHTML.indexOf('&#10;') > 0
}

// #3663: IE encodes newlines inside attribute values while other browsers don't
const shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
// #6828: chrome encodes content in a[href]
const shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

export { shouldDecodeNewlines, shouldDecodeNewlinesForHref };
