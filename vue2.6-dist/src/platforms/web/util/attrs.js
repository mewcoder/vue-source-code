import { makeMap } from '../../../shared/util.js';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
const isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
const acceptValue = makeMap('input,textarea,option,select,progress');
const mustUseProp = (tag, type, attr) => {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

const isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

const isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');

const convertEnumeratedValue = (key, value) => {
  return isFalsyAttrValue(value) || value === 'false'
    ? 'false'
    // allow arbitrary string value for contenteditable
    : key === 'contenteditable' && isValidContentEditableValue(value)
      ? value
      : 'true'
};

const isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,' +
  'truespeed,typemustmatch,visible'
);

const xlinkNS = 'http://www.w3.org/1999/xlink';

const isXlink = (name) => {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

const getXlinkProp = (name) => {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

const isFalsyAttrValue = (val) => {
  return val == null || val === false
};

export { convertEnumeratedValue, getXlinkProp, isBooleanAttr, isEnumeratedAttr, isFalsyAttrValue, isReservedAttr, isXlink, mustUseProp, xlinkNS };
