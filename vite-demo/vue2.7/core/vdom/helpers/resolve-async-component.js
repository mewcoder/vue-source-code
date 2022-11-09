/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
import { isTrue, isDef, remove, isObject, isPromise, isUndef, once } from '../../../shared/util.js';
import { hasSymbol } from '../../util/env.js';
import '../../util/options.js';
import { warn } from '../../util/debug.js';
import '../../observer/index.js';
import '../../observer/dep.js';
import '../../util/next-tick.js';
import { createEmptyVNode } from '../vnode.js';
import { currentRenderingInstance } from '../../instance/render.js';

function ensureCtor(comp, base) {
    if (comp.__esModule || (hasSymbol && comp[Symbol.toStringTag] === 'Module')) {
        comp = comp.default;
    }
    return isObject(comp) ? base.extend(comp) : comp;
}
function createAsyncPlaceholder(factory, data, context, children, tag) {
    var node = createEmptyVNode();
    node.asyncFactory = factory;
    node.asyncMeta = { data: data, context: context, children: children, tag: tag };
    return node;
}
function resolveAsyncComponent(factory, baseCtor) {
    if (isTrue(factory.error) && isDef(factory.errorComp)) {
        return factory.errorComp;
    }
    if (isDef(factory.resolved)) {
        return factory.resolved;
    }
    var owner = currentRenderingInstance;
    if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
        // already pending
        factory.owners.push(owner);
    }
    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
        return factory.loadingComp;
    }
    if (owner && !isDef(factory.owners)) {
        var owners_1 = (factory.owners = [owner]);
        var sync_1 = true;
        var timerLoading_1 = null;
        var timerTimeout_1 = null;
        owner.$on('hook:destroyed', function () { return remove(owners_1, owner); });
        var forceRender_1 = function (renderCompleted) {
            for (var i = 0, l = owners_1.length; i < l; i++) {
                owners_1[i].$forceUpdate();
            }
            if (renderCompleted) {
                owners_1.length = 0;
                if (timerLoading_1 !== null) {
                    clearTimeout(timerLoading_1);
                    timerLoading_1 = null;
                }
                if (timerTimeout_1 !== null) {
                    clearTimeout(timerTimeout_1);
                    timerTimeout_1 = null;
                }
            }
        };
        var resolve = once(function (res) {
            // cache resolved
            factory.resolved = ensureCtor(res, baseCtor);
            // invoke callbacks only if this is not a synchronous resolve
            // (async resolves are shimmed as synchronous during SSR)
            if (!sync_1) {
                forceRender_1(true);
            }
            else {
                owners_1.length = 0;
            }
        });
        var reject_1 = once(function (reason) {
            warn("Failed to resolve async component: ".concat(String(factory)) +
                    (reason ? "\nReason: ".concat(reason) : ''));
            if (isDef(factory.errorComp)) {
                factory.error = true;
                forceRender_1(true);
            }
        });
        var res_1 = factory(resolve, reject_1);
        if (isObject(res_1)) {
            if (isPromise(res_1)) {
                // () => Promise
                if (isUndef(factory.resolved)) {
                    res_1.then(resolve, reject_1);
                }
            }
            else if (isPromise(res_1.component)) {
                res_1.component.then(resolve, reject_1);
                if (isDef(res_1.error)) {
                    factory.errorComp = ensureCtor(res_1.error, baseCtor);
                }
                if (isDef(res_1.loading)) {
                    factory.loadingComp = ensureCtor(res_1.loading, baseCtor);
                    if (res_1.delay === 0) {
                        factory.loading = true;
                    }
                    else {
                        // @ts-expect-error NodeJS timeout type
                        timerLoading_1 = setTimeout(function () {
                            timerLoading_1 = null;
                            if (isUndef(factory.resolved) && isUndef(factory.error)) {
                                factory.loading = true;
                                forceRender_1(false);
                            }
                        }, res_1.delay || 200);
                    }
                }
                if (isDef(res_1.timeout)) {
                    // @ts-expect-error NodeJS timeout type
                    timerTimeout_1 = setTimeout(function () {
                        timerTimeout_1 = null;
                        if (isUndef(factory.resolved)) {
                            reject_1("timeout (".concat(res_1.timeout, "ms)") );
                        }
                    }, res_1.timeout);
                }
            }
        }
        sync_1 = false;
        // return in case resolved synchronously
        return factory.loading ? factory.loadingComp : factory.resolved;
    }
}

export { createAsyncPlaceholder, resolveAsyncComponent };
