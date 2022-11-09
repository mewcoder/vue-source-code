import { parseText } from '../../../../compiler/parser/text-parser.js';
import { parseStyleText } from '../../util/style.js';
import { baseWarn, getAndRemoveAttr, getBindingAttr } from '../../../../compiler/helpers.js';

/*  */

function transformNode (el, options) {
  const warn = options.warn || baseWarn;
  const staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    {
      const res = parseText(staticStyle, options.delimiters);
      if (res) {
        warn(
          `style="${staticStyle}": ` +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.',
          el.rawAttrsMap['style']
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  const styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData (el) {
  let data = '';
  if (el.staticStyle) {
    data += `staticStyle:${el.staticStyle},`;
  }
  if (el.styleBinding) {
    data += `style:(${el.styleBinding}),`;
  }
  return data
}

var style = {
  staticKeys: ['staticStyle'],
  transformNode,
  genData
};

export { style as default };
