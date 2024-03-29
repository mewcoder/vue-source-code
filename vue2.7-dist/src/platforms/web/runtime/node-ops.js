import '../../../shared/util.js';
import '../../../core/util/env.js';
import '../../../core/util/options.js';
import '../../../core/util/debug.js';
import '../../../core/observer/dep.js';
import '../../../core/observer/array.js';
import '../../../core/observer/traverse.js';
import '../../../core/observer/scheduler.js';
import '../../../core/instance/proxy.js';
import '../../../core/util/perf.js';
import '../../../core/vdom/create-functional-component.js';
import '../../../core/util/next-tick.js';
import '../util/attrs.js';
import { namespaceMap } from '../util/element.js';

function createElement(tagName, vnode) {
    const elm = document.createElement(tagName);
    if (tagName !== 'select') {
        return elm;
    }
    // false or null will remove the attribute but undefined will not
    if (vnode.data &&
        vnode.data.attrs &&
        vnode.data.attrs.multiple !== undefined) {
        elm.setAttribute('multiple', 'multiple');
    }
    return elm;
}
function createElementNS(namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName);
}
function createTextNode(text) {
    return document.createTextNode(text);
}
function createComment(text) {
    return document.createComment(text);
}
function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}
function removeChild(node, child) {
    node.removeChild(child);
}
function appendChild(node, child) {
    node.appendChild(child);
}
function parentNode(node) {
    return node.parentNode;
}
function nextSibling(node) {
    return node.nextSibling;
}
function tagName(node) {
    return node.tagName;
}
function setTextContent(node, text) {
    node.textContent = text;
}
function setStyleScope(node, scopeId) {
    node.setAttribute(scopeId, '');
}

export { appendChild, createComment, createElement, createElementNS, createTextNode, insertBefore, nextSibling, parentNode, removeChild, setStyleScope, setTextContent, tagName };
