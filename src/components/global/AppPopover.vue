<!--
    popover弹出层
    https://element-plus.gitee.io/zh-CN/component/popover.html
 -->
<template>
  <el-popover v-bind="popoverPropsResult">
    <!-- 各插槽中转 -->
    <template v-for="name in Object.keys($slots)" #[name]>
      <slot :name="name"></slot>
    </template>
  </el-popover>
</template>
<script lang="ts" setup name="AppPopover">
  import { computed, useAttrs } from 'vue';
  import { utils } from '@/utils';
  const props = defineProps({
    // 组件属性
    imageProps: { type: Object, default: () => ({}) },
    // 样式
    styles: {
      type: Object, default: () => ({
        width: '100%', height: '100%',
      }),
    },
  });
  const attrs = useAttrs();
  // 组件属性合并结果
  const popoverPropsResult = computed(() => {
    return utils.deepAssign(
      {
        popperClass: 'AppPopover-root',
        trigger: 'hover',
        width: '150px',
        placement: 'bottom',
      },
      attrs,
      props.imageProps,
    );
  });
</script>
<style scoped lang="scss"></style>
