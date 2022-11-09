/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import { isUndef, isDef } from '../../../../shared/util.js';
import '../../../../core/util/env.js';
import '../../../../core/util/options.js';
import '../../../../core/util/debug.js';
import '../../../../core/observer/index.js';
import '../../../../core/observer/dep.js';
import '../../../../core/util/next-tick.js';
import '../../util/attrs.js';
import { genClassForVnode, concat, stringifyClass } from '../../util/class.js';
import '../../util/element.js';

function updateClass(oldVnode, vnode) {
    var el = vnode.elm;
    var data = vnode.data;
    var oldData = oldVnode.data;
    if (isUndef(data.staticClass) &&
        isUndef(data.class) &&
        (isUndef(oldData) ||
            (isUndef(oldData.staticClass) && isUndef(oldData.class)))) {
        return;
    }
    var cls = genClassForVnode(vnode);
    // handle transition classes
    var transitionClass = el._transitionClasses;
    if (isDef(transitionClass)) {
        cls = concat(cls, stringifyClass(transitionClass));
    }
    // set the class
    if (cls !== el._prevClass) {
        el.setAttribute('class', cls);
        el._prevClass = cls;
    }
}
var klass = {
    create: updateClass,
    update: updateClass
};

export { klass as default };
