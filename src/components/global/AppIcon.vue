<!-- Icon 图标
https://element-plus.gitee.io/zh-CN/component/icon.html#%E5%9B%BE%E6%A0%87%E9%9B%86%E5%90%88
已配置属性、插槽的同名透传，属性命名冲突时可通过 iconProps 对象传进来

使用示例：
<AppIcon name="Aim"></AppIcon>
<AppIcon :name="Aim"></AppIcon>
<AppIcon>
  <Aim></Aim>
</AppIcon>
 -->
<template>
  <el-icon class="AppIcon-root" v-bind="iconPropsResult">
    <!-- 插槽透传 -->
    <component
      :is="name"
      v-if="!$slots.default"
      class="icon-component"
    ></component>
    <template v-for="name in Object.keys($slots)" #[name]>
      <slot :name="name"></slot>
    </template>
  </el-icon>
</template>
<script lang="ts">
import * as icons from "@element-plus/icons-vue";
export default {
  name: "AppIcon",
  components: { ...icons },
};
</script>
<script lang="ts" setup name="AppIcon">
import { useAttrs, computed } from "vue";
import objUtil from "@/utils/object";

const props = defineProps({
  // 组件属性
  iconProps: {
    type: Object,
    default() {
      return {};
    },
  },
  // 组件名，字符串或组件
  name: { type: [String, Object], default: "" },
});
const attrs = useAttrs();
// 组件属性合并结果
const iconPropsResult = computed(() => {
  return objUtil.deepAssign({}, attrs, props.iconProps);
});
</script>
<style scoped lang="scss">
.AppIcon-root {
  align-self: center;
  .icon-component {
    vertical-align: middle;
    :hover {
      opacity: 0.9;
    }
  }
}
</style>
