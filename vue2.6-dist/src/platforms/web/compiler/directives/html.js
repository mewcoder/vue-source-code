import { addProp } from '../../../../compiler/helpers.js';

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', `_s(${dir.value})`, dir);
  }
}

export { html as default };
