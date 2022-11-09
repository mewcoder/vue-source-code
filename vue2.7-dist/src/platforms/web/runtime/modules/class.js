import { isUndef, isDef } from '../../../../shared/util.js';
import '../../../../core/util/env.js';
import '../../../../core/util/options.js';
import '../../../../core/util/debug.js';
import '../../../../core/observer/dep.js';
import '../../../../core/observer/array.js';
import '../../../../core/observer/traverse.js';
import '../../../../core/observer/scheduler.js';
import '../../../../core/instance/proxy.js';
import '../../../../core/util/perf.js';
import '../../../../core/vdom/create-functional-component.js';
import '../../../../core/util/next-tick.js';
import '../../util/attrs.js';
import { genClassForVnode, concat, stringifyClass } from '../../util/class.js';
import '../../util/element.js';

function updateClass(oldVnode, vnode) {
    const el = vnode.elm;
    const data = vnode.data;
    const oldData = oldVnode.data;
    if (isUndef(data.staticClass) &&
        isUndef(data.class) &&
        (isUndef(oldData) ||
            (isUndef(oldData.staticClass) && isUndef(oldData.class)))) {
        return;
    }
    let cls = genClassForVnode(vnode);
    // handle transition classes
    const transitionClass = el._transitionClasses;
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
