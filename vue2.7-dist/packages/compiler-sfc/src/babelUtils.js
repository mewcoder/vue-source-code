import { walk } from '../../../node_modules/.pnpm/estree-walker@2.0.2/node_modules/estree-walker/dist/esm/estree-walker.js';

// https://github.com/vuejs/core/blob/main/packages/compiler-core/src/babelUtils.ts
function walkIdentifiers(root, onIdentifier, onNode) {
    const parentStack = [];
    const knownIds = Object.create(null);
    const rootExp = root.type === 'Program' &&
        root.body[0].type === 'ExpressionStatement' &&
        root.body[0].expression;
    walk(root, {
        enter(node, parent) {
            parent && parentStack.push(parent);
            if (parent &&
                parent.type.startsWith('TS') &&
                parent.type !== 'TSAsExpression' &&
                parent.type !== 'TSNonNullExpression' &&
                parent.type !== 'TSTypeAssertion') {
                return this.skip();
            }
            if (onNode)
                onNode(node);
            if (node.type === 'Identifier') {
                const isLocal = !!knownIds[node.name];
                const isRefed = isReferencedIdentifier(node, parent, parentStack);
                if ((isRefed && !isLocal)) {
                    onIdentifier(node, parent, parentStack, isRefed, isLocal);
                }
            }
            else if (node.type === 'ObjectProperty' &&
                parent.type === 'ObjectPattern') {
                node.inPattern = true;
            }
            else if (isFunctionType(node)) {
                // walk function expressions and add its arguments to known identifiers
                // so that we don't prefix them
                walkFunctionParams(node, id => markScopeIdentifier(node, id, knownIds));
            }
            else if (node.type === 'BlockStatement') {
                // #3445 record block-level local variables
                walkBlockDeclarations(node, id => markScopeIdentifier(node, id, knownIds));
            }
        },
        leave(node, parent) {
            parent && parentStack.pop();
            if (node !== rootExp && node.scopeIds) {
                for (const id of node.scopeIds) {
                    knownIds[id]--;
                    if (knownIds[id] === 0) {
                        delete knownIds[id];
                    }
                }
            }
        }
    });
}
function isReferencedIdentifier(id, parent, parentStack) {
    if (!parent) {
        return true;
    }
    // is a special keyword but parsed as identifier
    if (id.name === 'arguments') {
        return false;
    }
    if (isReferenced(id, parent)) {
        return true;
    }
    // babel's isReferenced check returns false for ids being assigned to, so we
    // need to cover those cases here
    switch (parent.type) {
        case 'AssignmentExpression':
        case 'AssignmentPattern':
            return true;
        case 'ObjectPattern':
        case 'ArrayPattern':
            return isInDestructureAssignment(parent, parentStack);
    }
    return false;
}
function isInDestructureAssignment(parent, parentStack) {
    if (parent &&
        (parent.type === 'ObjectProperty' || parent.type === 'ArrayPattern')) {
        let i = parentStack.length;
        while (i--) {
            const p = parentStack[i];
            if (p.type === 'AssignmentExpression') {
                return true;
            }
            else if (p.type !== 'ObjectProperty' && !p.type.endsWith('Pattern')) {
                break;
            }
        }
    }
    return false;
}
function walkFunctionParams(node, onIdent) {
    for (const p of node.params) {
        for (const id of extractIdentifiers(p)) {
            onIdent(id);
        }
    }
}
function walkBlockDeclarations(block, onIdent) {
    for (const stmt of block.body) {
        if (stmt.type === 'VariableDeclaration') {
            if (stmt.declare)
                continue;
            for (const decl of stmt.declarations) {
                for (const id of extractIdentifiers(decl.id)) {
                    onIdent(id);
                }
            }
        }
        else if (stmt.type === 'FunctionDeclaration' ||
            stmt.type === 'ClassDeclaration') {
            if (stmt.declare || !stmt.id)
                continue;
            onIdent(stmt.id);
        }
    }
}
function extractIdentifiers(param, nodes = []) {
    switch (param.type) {
        case 'Identifier':
            nodes.push(param);
            break;
        case 'MemberExpression':
            let object = param;
            while (object.type === 'MemberExpression') {
                object = object.object;
            }
            nodes.push(object);
            break;
        case 'ObjectPattern':
            for (const prop of param.properties) {
                if (prop.type === 'RestElement') {
                    extractIdentifiers(prop.argument, nodes);
                }
                else {
                    extractIdentifiers(prop.value, nodes);
                }
            }
            break;
        case 'ArrayPattern':
            param.elements.forEach(element => {
                if (element)
                    extractIdentifiers(element, nodes);
            });
            break;
        case 'RestElement':
            extractIdentifiers(param.argument, nodes);
            break;
        case 'AssignmentPattern':
            extractIdentifiers(param.left, nodes);
            break;
    }
    return nodes;
}
function markScopeIdentifier(node, child, knownIds) {
    const { name } = child;
    if (node.scopeIds && node.scopeIds.has(name)) {
        return;
    }
    if (name in knownIds) {
        knownIds[name]++;
    }
    else {
        knownIds[name] = 1;
    }
    (node.scopeIds || (node.scopeIds = new Set())).add(name);
}
const isFunctionType = (node) => {
    return /Function(?:Expression|Declaration)$|Method$/.test(node.type);
};
const isStaticProperty = (node) => node &&
    (node.type === 'ObjectProperty' || node.type === 'ObjectMethod') &&
    !node.computed;
/**
 * Copied from https://github.com/babel/babel/blob/main/packages/babel-types/src/validators/isReferenced.ts
 * To avoid runtime dependency on @babel/types (which includes process references)
 * This file should not change very often in babel but we may need to keep it
 * up-to-date from time to time.
 *
 * https://github.com/babel/babel/blob/main/LICENSE
 *
 */
function isReferenced(node, parent, grandparent) {
    switch (parent.type) {
        // yes: PARENT[NODE]
        // yes: NODE.child
        // no: parent.NODE
        case 'MemberExpression':
        case 'OptionalMemberExpression':
            if (parent.property === node) {
                return !!parent.computed;
            }
            return parent.object === node;
        case 'JSXMemberExpression':
            return parent.object === node;
        // no: let NODE = init;
        // yes: let id = NODE;
        case 'VariableDeclarator':
            return parent.init === node;
        // yes: () => NODE
        // no: (NODE) => {}
        case 'ArrowFunctionExpression':
            return parent.body === node;
        // no: class { #NODE; }
        // no: class { get #NODE() {} }
        // no: class { #NODE() {} }
        // no: class { fn() { return this.#NODE; } }
        case 'PrivateName':
            return false;
        // no: class { NODE() {} }
        // yes: class { [NODE]() {} }
        // no: class { foo(NODE) {} }
        case 'ClassMethod':
        case 'ClassPrivateMethod':
        case 'ObjectMethod':
            if (parent.key === node) {
                return !!parent.computed;
            }
            return false;
        // yes: { [NODE]: "" }
        // no: { NODE: "" }
        // depends: { NODE }
        // depends: { key: NODE }
        case 'ObjectProperty':
            if (parent.key === node) {
                return !!parent.computed;
            }
            // parent.value === node
            return !grandparent || grandparent.type !== 'ObjectPattern';
        // no: class { NODE = value; }
        // yes: class { [NODE] = value; }
        // yes: class { key = NODE; }
        case 'ClassProperty':
            if (parent.key === node) {
                return !!parent.computed;
            }
            return true;
        case 'ClassPrivateProperty':
            return parent.key !== node;
        // no: class NODE {}
        // yes: class Foo extends NODE {}
        case 'ClassDeclaration':
        case 'ClassExpression':
            return parent.superClass === node;
        // yes: left = NODE;
        // no: NODE = right;
        case 'AssignmentExpression':
            return parent.right === node;
        // no: [NODE = foo] = [];
        // yes: [foo = NODE] = [];
        case 'AssignmentPattern':
            return parent.right === node;
        // no: NODE: for (;;) {}
        case 'LabeledStatement':
            return false;
        // no: try {} catch (NODE) {}
        case 'CatchClause':
            return false;
        // no: function foo(...NODE) {}
        case 'RestElement':
            return false;
        case 'BreakStatement':
        case 'ContinueStatement':
            return false;
        // no: function NODE() {}
        // no: function foo(NODE) {}
        case 'FunctionDeclaration':
        case 'FunctionExpression':
            return false;
        // no: export NODE from "foo";
        // no: export * as NODE from "foo";
        case 'ExportNamespaceSpecifier':
        case 'ExportDefaultSpecifier':
            return false;
        // no: export { foo as NODE };
        // yes: export { NODE as foo };
        // no: export { NODE as foo } from "foo";
        case 'ExportSpecifier':
            // @ts-expect-error
            if (grandparent === null || grandparent === void 0 ? void 0 : grandparent.source) {
                return false;
            }
            return parent.local === node;
        // no: import NODE from "foo";
        // no: import * as NODE from "foo";
        // no: import { NODE as foo } from "foo";
        // no: import { foo as NODE } from "foo";
        // no: import NODE from "bar";
        case 'ImportDefaultSpecifier':
        case 'ImportNamespaceSpecifier':
        case 'ImportSpecifier':
            return false;
        // no: import "foo" assert { NODE: "json" }
        case 'ImportAttribute':
            return false;
        // no: <div NODE="foo" />
        case 'JSXAttribute':
            return false;
        // no: [NODE] = [];
        // no: ({ NODE }) = [];
        case 'ObjectPattern':
        case 'ArrayPattern':
            return false;
        // no: new.NODE
        // no: NODE.target
        case 'MetaProperty':
            return false;
        // yes: type X = { someProperty: NODE }
        // no: type X = { NODE: OtherType }
        case 'ObjectTypeProperty':
            return parent.key !== node;
        // yes: enum X { Foo = NODE }
        // no: enum X { NODE }
        case 'TSEnumMember':
            return parent.id !== node;
        // yes: { [NODE]: value }
        // no: { NODE: value }
        case 'TSPropertySignature':
            if (parent.key === node) {
                return !!parent.computed;
            }
            return true;
    }
    return true;
}

export { extractIdentifiers, isFunctionType, isInDestructureAssignment, isReferencedIdentifier, isStaticProperty, walkBlockDeclarations, walkFunctionParams, walkIdentifiers };
