import { addProp } from '../../../../compiler/helpers.js';

function text(el, dir) {
    if (dir.value) {
        addProp(el, 'textContent', `_s(${dir.value})`, dir);
    }
}

export { text as default };
