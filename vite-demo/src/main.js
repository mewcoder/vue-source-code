import Vue from "../../vue2.6-dist/platforms/web/entry-runtime-with-compiler";
// import Vue from './vue2.6'
// import Vue from 'vue'
import App from "./App.vue";

const app = new Vue({
  render: (h) => h(App),
}).$mount("#app");

