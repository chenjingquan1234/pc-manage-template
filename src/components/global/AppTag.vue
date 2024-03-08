<!-- tag 标签
  https://element-plus.gitee.io/zh-CN/component/tag.html
-->
<template>
  <el-tag v-bind="tagPropsResult" class="AppTag-root">
    <slot></slot>
  </el-tag>
</template>
<script lang="ts" setup name="AppTag">
  import { computed, useAttrs } from 'vue';
  import { utils } from '@/utils';
  const props = defineProps({
    // 组件属性
    tagProps: { type: Object, default: () => ({}) },
  });
  const attrs = useAttrs();
  // 组件属性合并结果
  const tagPropsResult = computed(() => {
    return utils.deepAssign(
      {
        type: '',
        closable: false,
        size: 'default',
        effect: 'light',
        round: false,
        'disable-transitions': true,
      },
      attrs,
      props.tagProps,
    );
  });
</script>