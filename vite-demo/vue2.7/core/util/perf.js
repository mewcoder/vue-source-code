/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import { inBrowser } from './env.js';

var mark;
var measure;
{
    var perf_1 = inBrowser && window.performance;
    /* istanbul ignore if */
    if (perf_1 &&
        // @ts-ignore
        perf_1.mark &&
        // @ts-ignore
        perf_1.measure &&
        // @ts-ignore
        perf_1.clearMarks &&
        // @ts-ignore
        perf_1.clearMeasures) {
        mark = function (tag) { return perf_1.mark(tag); };
        measure = function (name, startTag, endTag) {
            perf_1.measure(name, startTag, endTag);
            perf_1.clearMarks(startTag);
            perf_1.clearMarks(endTag);
            // perf.clearMeasures(name)
        };
    }
}

export { mark, measure };
