<!-- empty 空状态
  https://element-plus.gitee.io/zh-CN/component/empty.html
-->
<template>
  <el-empty v-bind="emptyPropsResult" class="AppEmpty-root"></el-empty>
</template>
<script setup lang="ts" name="AppEmpty">
  import { computed, useAttrs } from 'vue';
  import { utils } from '@/utils';
  import emptyImage from '@/assets/images/empty-pic.svg';

  const props = defineProps({
    // empty组件属性
    emptyProps: { type: Object, default: () => ({}) },
    // 是否有权限
    isHaveAuth: { type: Boolean, default: true },
  });
  const attrs = useAttrs();
  // 组件属性合并结果
  const emptyPropsResult = computed(() => {
    return utils.deepAssign(
      {
        description: props.isHaveAuth ? '暂无相关数据哦~' : '当前暂无权限哦~',
        // imageSize: 150,
        image: emptyImage,
      },
      attrs,
      props.emptyProps,
    );
  });
</script>
<style scoped lang="scss">
  .AppEmpty-root:deep(){ padding: 30px 0;
    .el-empty__description{ margin-top: 15px; line-height: 1.6; }
  }
</style>
