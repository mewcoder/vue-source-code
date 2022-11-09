import mergeSourceMap from '../../../node_modules/.pnpm/merge-source-map@1.1.0/node_modules/merge-source-map/index.js';
import { isFunction } from '../../../src/shared/util.js';

// .scss/.sass processor
const scss = (source, map, options) => {
    const nodeSass = require('sass');
    const finalOptions = Object.assign(Object.assign({}, options), { data: getSource(source, options.filename, options.additionalData), file: options.filename, outFile: options.filename, sourceMap: !!map });
    try {
        const result = nodeSass.renderSync(finalOptions);
        const dependencies = result.stats.includedFiles;
        if (map) {
            return {
                code: result.css.toString(),
                map: mergeSourceMap(map, JSON.parse(result.map.toString())),
                errors: [],
                dependencies
            };
        }
        return { code: result.css.toString(), errors: [], dependencies };
    }
    catch (e) {
        return { code: '', errors: [e], dependencies: [] };
    }
};
const sass = (source, map, options) => scss(source, map, Object.assign(Object.assign({}, options), { indentedSyntax: true }));
// .less
const less = (source, map, options) => {
    const nodeLess = require('less');
    let result;
    let error = null;
    nodeLess.render(getSource(source, options.filename, options.additionalData), Object.assign(Object.assign({}, options), { syncImport: true }), (err, output) => {
        error = err;
        result = output;
    });
    if (error)
        return { code: '', errors: [error], dependencies: [] };
    const dependencies = result.imports;
    if (map) {
        return {
            code: result.css.toString(),
            map: mergeSourceMap(map, result.map),
            errors: [],
            dependencies: dependencies
        };
    }
    return {
        code: result.css.toString(),
        errors: [],
        dependencies: dependencies
    };
};
// .styl
const styl = (source, map, options) => {
    const nodeStylus = require('stylus');
    try {
        const ref = nodeStylus(source);
        Object.keys(options).forEach(key => ref.set(key, options[key]));
        if (map)
            ref.set('sourcemap', { inline: false, comment: false });
        const result = ref.render();
        const dependencies = ref.deps();
        if (map) {
            return {
                code: result,
                map: mergeSourceMap(map, ref.sourcemap),
                errors: [],
                dependencies
            };
        }
        return { code: result, errors: [], dependencies };
    }
    catch (e) {
        return { code: '', errors: [e], dependencies: [] };
    }
};
function getSource(source, filename, additionalData) {
    if (!additionalData)
        return source;
    if (isFunction(additionalData)) {
        return additionalData(source, filename);
    }
    return additionalData + source;
}
const processors = {
    less,
    sass,
    scss,
    styl,
    stylus: styl
};

export { processors };
