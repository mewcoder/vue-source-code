function isAsyncPlaceholder(node) {
    // @ts-expect-error not really boolean type
    return node.isComment && node.asyncFactory;
}

export { isAsyncPlaceholder };
