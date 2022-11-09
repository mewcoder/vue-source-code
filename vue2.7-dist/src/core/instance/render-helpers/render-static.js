import { isArray } from '../../../shared/util.js';
import '../../util/env.js';
import '../../util/options.js';
import '../../util/debug.js';
import '../../observer/dep.js';
import '../../observer/array.js';
import '../../observer/traverse.js';
import '../../observer/scheduler.js';
import '../proxy.js';
import '../../util/perf.js';
import '../../vdom/create-functional-component.js';
import '../../util/next-tick.js';

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic(index, isInFor) {
    const cached = this._staticTrees || (this._staticTrees = []);
    let tree = cached[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree.
    if (tree && !isInFor) {
        return tree;
    }
    // otherwise, render a fresh tree.
    tree = cached[index] = this.$options.staticRenderFns[index].call(this._renderProxy, this._c, this // for render fns generated for functional component templates
    );
    markStatic(tree, `__static__${index}`, false);
    return tree;
}
/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce(tree, index, key) {
    markStatic(tree, `__once__${index}${key ? `_${key}` : ``}`, true);
    return tree;
}
function markStatic(tree, key, isOnce) {
    if (isArray(tree)) {
        for (let i = 0; i < tree.length; i++) {
            if (tree[i] && typeof tree[i] !== 'string') {
                markStaticNode(tree[i], `${key}_${i}`, isOnce);
            }
        }
    }
    else {
        markStaticNode(tree, key, isOnce);
    }
}
function markStaticNode(node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
}

export { markOnce, renderStatic };
