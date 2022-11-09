import { isTrue, isDef } from '../../../shared/util.js';
import '../../util/env.js';
import '../../util/options.js';
import '../../util/debug.js';
import '../../observer/dep.js';
import { createEmptyVNode } from '../vnode.js';
import '../../observer/array.js';
import '../../observer/traverse.js';
import '../../observer/scheduler.js';
import '../../config.js';
import '../../instance/proxy.js';
import '../../util/perf.js';
import '../create-functional-component.js';
import '../../util/next-tick.js';

function createAsyncPlaceholder(factory, data, context, children, tag) {
    const node = createEmptyVNode();
    node.asyncFactory = factory;
    node.asyncMeta = { data, context, children, tag };
    return node;
}
function resolveAsyncComponent(factory, baseCtor) {
    if (isTrue(factory.error) && isDef(factory.errorComp)) {
        return factory.errorComp;
    }
    if (isDef(factory.resolved)) {
        return factory.resolved;
    }
    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
        return factory.loadingComp;
    }
}

export { createAsyncPlaceholder, resolveAsyncComponent };
