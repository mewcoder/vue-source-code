/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import { genStaticKeys } from '../../../shared/util.js';
import '../../../core/util/env.js';
import '../../../core/util/options.js';
import '../../../core/util/debug.js';
import '../../../core/observer/index.js';
import '../../../core/observer/dep.js';
import '../../../core/util/next-tick.js';
import { mustUseProp } from '../util/attrs.js';
import { isPreTag, isReservedTag, getTagNamespace } from '../util/element.js';
import modules from './modules/index.js';
import directives from './directives/index.js';
import { isUnaryTag, canBeLeftOpenTag } from './util.js';

var baseOptions = {
    expectHTML: true,
    modules: modules,
    directives: directives,
    isPreTag: isPreTag,
    isUnaryTag: isUnaryTag,
    mustUseProp: mustUseProp,
    canBeLeftOpenTag: canBeLeftOpenTag,
    isReservedTag: isReservedTag,
    getTagNamespace: getTagNamespace,
    staticKeys: genStaticKeys(modules)
};

export { baseOptions };
