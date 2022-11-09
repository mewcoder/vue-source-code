/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import { makeMap } from '../../../shared/util.js';

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');
// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
    return ((attr === 'value' && acceptValue(tag) && type !== 'button') ||
        (attr === 'selected' && tag === 'option') ||
        (attr === 'checked' && tag === 'input') ||
        (attr === 'muted' && tag === 'video'));
};
var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');
var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');
var convertEnumeratedValue = function (key, value) {
    return isFalsyAttrValue(value) || value === 'false'
        ? 'false'
        : // allow arbitrary string value for contenteditable
            key === 'contenteditable' && isValidContentEditableValue(value)
                ? value
                : 'true';
};
var isBooleanAttr = makeMap('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
    'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
    'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
    'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
    'required,reversed,scoped,seamless,selected,sortable,' +
    'truespeed,typemustmatch,visible');
var xlinkNS = 'http://www.w3.org/1999/xlink';
var isXlink = function (name) {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink';
};
var getXlinkProp = function (name) {
    return isXlink(name) ? name.slice(6, name.length) : '';
};
var isFalsyAttrValue = function (val) {
    return val == null || val === false;
};

export { convertEnumeratedValue, getXlinkProp, isBooleanAttr, isEnumeratedAttr, isFalsyAttrValue, isReservedAttr, isXlink, mustUseProp, xlinkNS };
