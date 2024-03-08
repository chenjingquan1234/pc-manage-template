<!-- dev模式辅助组件 -->
<template>
  <el-tooltip v-if="show && import_meta_env.DEV" effect="light" content="仅dev模式显示">
    <div class="AppDev-root" v-bind="$attrs">
      <slot></slot>
    </div>
  </el-tooltip>
</template>
<script>
  export default {
    name: 'AppDev',
  };
</script>
<script setup>
  import { onMounted, ref } from 'vue';

  console.log(import.meta.env);
  const import_meta_env = import.meta.env;
  const show = ref(true);
  if (import.meta.env.DEV) {
    Object.assign(window, {
      dev: {
        open() {
          show.value = true;
        },
        close() {
          show.value = false;
        },
      },
    });
  }
  /**
   * 生命周期
   */
  onMounted(() => {

  });
</script>
<style scoped lang="scss">
  .AppDev-root{display: inline-flex;align-items: center;outline: 2px solid var(--el-color-warning);margin: 0 2px;}
</style>
