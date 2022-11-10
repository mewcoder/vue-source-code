import {
  parse,
  compileTemplate,
  compileScript,
  compileStyle,
} from "@vue/compiler-sfc";

export function parseSFC(vueStr) {
  try {
    const sfcDescription = parse(vueStr);

    debugger
    const template = compileTemplate({
      filename: "sfc.vue",
      source: sfcDescription.template.content,
      preprocessLang: sfcDescription.template.lang,
    });

    const script = compileScript(sfcDescription);

    const style = sfcDescription.styles[0];

    let styleRes = { code: "" };
    if (style) {
      styleRes = compileStyle({
        id: "v-scope-xxx",
        filename: "sfc.vue",
        source: style.content,
        map: style.map,
        scoped: false,
        preprocessLang: style.lang,
      });
    }

    debugger;

    return {
      template: template.code,
      script,
      style: styleRes.code,
      customBlocks,
    };
  } catch (e) {
    console.log(e);
  }
}

const str = `
<script setup>
import { ref } from 'vue'

const msg = ref('一个用户名!')
</script>

<template>
  <div>
    <svg width="200" height="250" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<text x="10" y="10"
        font-family="Verdana"
        font-size="12">
        {{msg}}
      </text>
      <rect x="10" y="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5"></rect>
		</svg>
  </div>
</template>

<style>
.test{
    color:red;
}

</style>

`;

parseSFC({
  source: str,
  filename: "test.vue",
});
