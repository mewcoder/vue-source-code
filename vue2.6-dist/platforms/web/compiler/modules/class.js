import { parseText } from '../../../../compiler/parser/text-parser.js';
import { baseWarn, getAndRemoveAttr, getBindingAttr } from '../../../../compiler/helpers.js';

/*  */

function transformNode (el, options) {
  const warn = options.warn || baseWarn;
  const staticClass = getAndRemoveAttr(el, 'class');
  if (staticClass) {
    const res = parseText(staticClass, options.delimiters);
    if (res) {
      warn(
        `class="${staticClass}": ` +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.',
        el.rawAttrsMap['class']
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  const classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData (el) {
  let data = '';
  if (el.staticClass) {
    data += `staticClass:${el.staticClass},`;
  }
  if (el.classBinding) {
    data += `class:${el.classBinding},`;
  }
  return data
}

var klass = {
  staticKeys: ['staticClass'],
  transformNode,
  genData
};

export { klass as default };
