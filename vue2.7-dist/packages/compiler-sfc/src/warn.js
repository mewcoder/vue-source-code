const hasWarned = {};
function warnOnce(msg) {
    const isNodeProd = typeof process !== 'undefined' && process.env.NODE_ENV === 'production';
    if (!isNodeProd && !hasWarned[msg]) {
        hasWarned[msg] = true;
        warn(msg);
    }
}
function warn(msg) {
    console.warn(`\x1b[1m\x1b[33m[@vue/compiler-sfc]\x1b[0m\x1b[33m ${msg}\x1b[0m\n`);
}

export { warn, warnOnce };
