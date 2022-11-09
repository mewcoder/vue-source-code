const SSR_ATTR = 'data-server-rendered';

const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

export { ASSET_TYPES, LIFECYCLE_HOOKS, SSR_ATTR };
