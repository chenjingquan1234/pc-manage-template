<template>
  <div class="AppSubhead-root">
    <h3><slot></slot></h3>
  </div>
</template>

<script setup lang="ts" name="AppSubhead">
  import { toRefs } from 'vue';
  // 父组件传递的值
  interface Props {
    title?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    title: '标题',
  });
  const { title } = toRefs(props);
</script>

<style lang="scss" scoped>
  .AppSubhead-root{
    h3{ font-size: 18px; color: #222633; font-weight: 600; display: flex; align-items: center;
      &::before{ content: ""; width: 4px; height: 16px; background-color: var(--el-color-primary); display: inline-block; vertical-align: middle; margin-right: 8px;}
    }
  }
</style>
