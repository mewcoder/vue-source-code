<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
    default: "",
  },
  render(h) {
    return h("h1", ["你好", this.msg]);
  },
};
</script>
