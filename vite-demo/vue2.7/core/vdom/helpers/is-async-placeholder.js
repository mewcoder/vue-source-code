/*!
 * Vue.js v2.7.13
 * (c) 2014-2022 Evan You
 * Released under the MIT License.
 */
function isAsyncPlaceholder(node) {
    // @ts-expect-error not really boolean type
    return node.isComment && node.asyncFactory;
}

export { isAsyncPlaceholder };
