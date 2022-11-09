export { customRef, isRef, proxyRefs, ref, shallowRef, toRef, toRefs, triggerRef, unref } from './reactivity/ref.js';
export { isProxy, isReactive, isReadonly, isShallow, markRaw, reactive, shallowReactive, toRaw } from './reactivity/reactive.js';
export { readonly, shallowReadonly } from './reactivity/readonly.js';
export { computed } from './reactivity/computed.js';
export { watch, watchEffect, watchPostEffect, watchSyncEffect } from './apiWatch.js';
export { EffectScope, effectScope, getCurrentScope, onScopeDispose } from './reactivity/effectScope.js';
export { inject, provide } from './apiInject.js';
export { h } from './h.js';
export { getCurrentInstance } from './currentInstance.js';
export { mergeDefaults, useAttrs, useListeners, useSlots } from './apiSetup.js';
export { nextTick } from '../core/util/next-tick.js';
export { del, set } from '../core/observer/index.js';
export { useCssModule } from './sfc-helpers/useCssModule.js';
export { useCssVars } from './sfc-helpers/useCssVars.js';
export { defineAsyncComponent } from './apiAsyncComponent.js';
export { onActivated, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onDeactivated, onErrorCaptured, onMounted, onRenderTracked, onRenderTriggered, onServerPrefetch, onUnmounted, onUpdated } from './apiLifecycle.js';

/**
 * Note: also update dist/vue.runtime.mjs when adding new exports to this file.
 */
const version = '2.7.13';
/**
 * @internal type is manually declared in <root>/types/v3-define-component.d.ts
 */
function defineComponent(options) {
    return options;
}

export { defineComponent, version };
