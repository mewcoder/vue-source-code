/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import Transition from './transition.js';
import TransitionGroup from './transition-group.js';

var platformComponents = {
    Transition: Transition,
    TransitionGroup: TransitionGroup
};

export { platformComponents as default };
