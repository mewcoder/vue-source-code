<script>
import HelloWorld from "./components/HelloWorld.vue";

debugger
export default {
  name: "App",
  components: {
    HelloWorld,
  },
  data() {
    return {
      message: '小华',
    }
  },
  methods: {
    handleClick() {
      this.message = "test";
    },
  },
};
</script>

<template>
  <div id="app">
    <HelloWorld :msg="message" />
    <button @click="handleClick">handleClick</button>
  </div>
</template>
