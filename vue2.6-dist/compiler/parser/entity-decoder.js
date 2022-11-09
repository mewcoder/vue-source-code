/*  */

let decoder;

var he = {
  decode (html) {
    decoder = decoder || document.createElement('div');
    decoder.innerHTML = html;
    return decoder.textContent
  }
};

export { he as default };
