import attrs from './attrs.js';
import klass from './class.js';
import events from './events.js';
import domProps from './dom-props.js';
import style from './style.js';
import transition from './transition.js';

var platformModules = [attrs, klass, events, domProps, style, transition];

export { platformModules as default };
