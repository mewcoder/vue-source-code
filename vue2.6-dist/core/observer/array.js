import '../../shared/util.js';
import { def } from '../util/lang.js';
import '../util/env.js';
import '../util/options.js';
import '../util/debug.js';
import './dep.js';
import '../util/next-tick.js';

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method];
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) ob.observeArray(inserted);
    // notify change
    ob.dep.notify();
    return result
  });
});

export { arrayMethods };
