import config from '../config.js';
import { makeMap } from '../../shared/util.js';
import { isNative } from '../util/env.js';
import '../util/options.js';
import { warn } from '../util/debug.js';
import '../observer/dep.js';
import '../observer/array.js';
import '../observer/traverse.js';
import '../observer/scheduler.js';
import '../util/perf.js';
import '../vdom/create-functional-component.js';
import '../util/next-tick.js';

/* not type checking this file because flow doesn't play well with Proxy */
if (process.env.NODE_ENV !== 'production') {
    makeMap('Infinity,undefined,NaN,isFinite,isNaN,' +
        'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
        'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,' +
        'require' // for Webpack/Browserify
    );
    const hasProxy = typeof Proxy !== 'undefined' && isNative(Proxy);
    if (hasProxy) {
        const isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
        config.keyCodes = new Proxy(config.keyCodes, {
            set(target, key, value) {
                if (isBuiltInModifier(key)) {
                    warn(`Avoid overwriting built-in modifier in config.keyCodes: .${key}`);
                    return false;
                }
                else {
                    target[key] = value;
                    return true;
                }
            }
        });
    }
}
