import { RAW, EXPRESSION } from './codegen.js';
import { propsToAttrMap, isRenderableAttr } from '../util.js';
import { isEnumeratedAttr, isBooleanAttr } from '../../../../src/platforms/web/util/attrs.js';

const plainStringRE = /^"(?:[^"\\]|\\.)*"$|^'(?:[^'\\]|\\.)*'$/;
// let the model AST transform translate v-model into appropriate
// props bindings
function applyModelTransform(el, state) {
    if (el.directives) {
        for (let i = 0; i < el.directives.length; i++) {
            const dir = el.directives[i];
            if (dir.name === 'model') {
                state.directives.model(el, dir, state.warn);
                // remove value for textarea as its converted to text
                if (el.tag === 'textarea' && el.props) {
                    el.props = el.props.filter(p => p.name !== 'value');
                }
                break;
            }
        }
    }
}
function genAttrSegments(attrs) {
    return attrs.map(({ name, value }) => genAttrSegment(name, value));
}
function genDOMPropSegments(props, attrs) {
    const segments = [];
    props.forEach(({ name, value }) => {
        name = propsToAttrMap[name] || name.toLowerCase();
        if (isRenderableAttr(name) &&
            !(attrs && attrs.some(a => a.name === name))) {
            segments.push(genAttrSegment(name, value));
        }
    });
    return segments;
}
function genAttrSegment(name, value) {
    if (plainStringRE.test(value)) {
        // force double quote
        value = value.replace(/^'|'$/g, '"');
        // force enumerated attr to "true"
        if (isEnumeratedAttr(name) && value !== `"false"`) {
            value = `"true"`;
        }
        return {
            type: RAW,
            value: isBooleanAttr(name)
                ? ` ${name}="${name}"`
                : value === '""'
                    ? ` ${name}`
                    : ` ${name}="${JSON.parse(value)}"`
        };
    }
    else {
        return {
            type: EXPRESSION,
            value: `_ssrAttr(${JSON.stringify(name)},${value})`
        };
    }
}
function genClassSegments(staticClass, classBinding) {
    if (staticClass && !classBinding) {
        return [{ type: RAW, value: ` class="${JSON.parse(staticClass)}"` }];
    }
    else {
        return [
            {
                type: EXPRESSION,
                value: `_ssrClass(${staticClass || 'null'},${classBinding || 'null'})`
            }
        ];
    }
}
function genStyleSegments(staticStyle, parsedStaticStyle, styleBinding, vShowExpression) {
    if (staticStyle && !styleBinding && !vShowExpression) {
        return [{ type: RAW, value: ` style=${JSON.stringify(staticStyle)}` }];
    }
    else {
        return [
            {
                type: EXPRESSION,
                value: `_ssrStyle(${parsedStaticStyle || 'null'},${styleBinding || 'null'}, ${vShowExpression
                    ? `{ display: (${vShowExpression}) ? '' : 'none' }`
                    : 'null'})`
            }
        ];
    }
}

export { applyModelTransform, genAttrSegments, genClassSegments, genDOMPropSegments, genStyleSegments };
