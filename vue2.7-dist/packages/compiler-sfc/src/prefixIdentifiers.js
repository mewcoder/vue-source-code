import MagicString from '../../../node_modules/.pnpm/magic-string@0.25.9/node_modules/magic-string/dist/magic-string.es.js';
import { parseExpression as parseExpression_1 } from '../../../node_modules/.pnpm/@babel_parser@7.19.4/node_modules/@babel/parser/lib/index.js';
import { makeMap } from '../../../src/shared/util.js';
import { walkIdentifiers, isStaticProperty } from './babelUtils.js';

const doNotPrefix = makeMap('Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require,' + // for webpack
    'arguments,' + // parsed as identifier but is a special keyword...
    '_c' // cached to save property access
);
/**
 * The input is expected to be a valid expression.
 */
function prefixIdentifiers(source, isFunctional = false, isTS = false, babelOptions = {}, bindings) {
    const s = new MagicString(source);
    const plugins = [
        ...(isTS ? ['typescript'] : []),
        ...((babelOptions === null || babelOptions === void 0 ? void 0 : babelOptions.plugins) || [])
    ];
    const ast = parseExpression_1(source, Object.assign(Object.assign({}, babelOptions), { plugins }));
    const isScriptSetup = bindings && bindings.__isScriptSetup !== false;
    walkIdentifiers(ast, (ident, parent) => {
        const { name } = ident;
        if (doNotPrefix(name)) {
            return;
        }
        let prefix = `_vm.`;
        if (isScriptSetup) {
            const type = bindings[name];
            if (type && type.startsWith('setup')) {
                prefix = `_setup.`;
            }
        }
        if (isStaticProperty(parent) && parent.shorthand) {
            // property shorthand like { foo }, we need to add the key since
            // we rewrite the value
            // { foo } -> { foo: _vm.foo }
            s.appendLeft(ident.end, `: ${prefix}${name}`);
        }
        else {
            s.prependRight(ident.start, prefix);
        }
    }, node => {
        if (node.type === 'WithStatement') {
            s.remove(node.start, node.body.start + 1);
            s.remove(node.end - 1, node.end);
            if (!isFunctional) {
                s.prependRight(node.start, `var _vm=this,_c=_vm._self._c${isScriptSetup ? `,_setup=_vm._self._setupProxy;` : `;`}`);
            }
        }
    });
    return s.toString();
}

export { prefixIdentifiers };
