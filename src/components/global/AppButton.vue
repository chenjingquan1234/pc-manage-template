<!-- Button 按钮
https://element-plus.gitee.io/zh-CN/component/button.html#button-%E5%B1%9E%E6%80%A7
已配置属性、插槽的同名透传，属性命名冲突时可通过 buttonProps 对象传进来

使用示例：
同 el-button

加强：icon:同AppIcon的name属性，可传字符串
-->
<template>
  <el-button class="AppButton-root" v-bind="buttonPropsResult" @click="onClick">
    <AppIcon v-if="icon" :name="icon"></AppIcon>
    <!-- 插槽透传 -->
    <template v-for="name in Object.keys($slots)" :key="name" #[name]>
      <template v-if="name === 'default'">
        <AppIcon v-if="icon" :name="icon" style="margin-right: 6px"></AppIcon>
        <slot :name="name"></slot>
      </template>
      <slot v-else :name="name"></slot>
    </template>
  </el-button>
</template>
<script lang="ts" setup name="AppButton">
import objUtil from "@/utils/object";
import { useAttrs, computed } from "vue";
const props = defineProps({
  // 组件属性
  buttonProps: {
    type: Object,
    default() {
      return {};
    },
  },
  // 部分同名属性加强
  icon: { type: [String, Object], default: "" },
});
const attrs = useAttrs();
// 组件属性合并结果
const buttonPropsResult = computed(() => {
  return objUtil.deepAssign(
    {
      size: "default",
    },
    attrs,
    props.buttonProps
  );
});
// 按钮点击，失去焦点时样式恢复
function onClick(e) {
  let target = e.target;
  if (["SPAN", "I"].includes(target.nodeName)) {
    target = e.target.parentNode;
  }
  target.blur();
}
</script>
<style scoped lang="scss"></style>
