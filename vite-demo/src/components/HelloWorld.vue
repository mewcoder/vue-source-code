<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
    default: "",
  },
};
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}
</style>
