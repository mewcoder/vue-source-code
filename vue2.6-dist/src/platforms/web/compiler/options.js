import { genStaticKeys } from '../../../shared/util.js';
import '../../../core/util/env.js';
import '../../../core/util/options.js';
import '../../../core/util/debug.js';
import '../../../core/observer/dep.js';
import '../../../core/observer/array.js';
import '../../../core/util/next-tick.js';
import { mustUseProp } from '../util/attrs.js';
import { isPreTag, isReservedTag, getTagNamespace } from '../util/element.js';
import modules from './modules/index.js';
import directives from './directives/index.js';
import { isUnaryTag, canBeLeftOpenTag } from './util.js';

/*  */

const baseOptions = {
  expectHTML: true,
  modules,
  directives,
  isPreTag,
  isUnaryTag,
  mustUseProp,
  canBeLeftOpenTag,
  isReservedTag,
  getTagNamespace,
  staticKeys: genStaticKeys(modules)
};

export { baseOptions };
