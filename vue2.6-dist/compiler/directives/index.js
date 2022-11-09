import on from './on.js';
import bind from './bind.js';
import { noop } from '../../shared/util.js';

/*  */

var baseDirectives = {
  on,
  bind,
  cloak: noop
};

export { baseDirectives as default };
