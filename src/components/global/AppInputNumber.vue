<!-- input 数字输入框
  https://element-plus.org/zh-CN/component/input-number.html
-->
<template>
  <el-input-number v-model="modelValueResult" v-bind="inputPropsResult" class="AppInputNumber-root">
    <!-- 插槽透传 -->
    <template v-for="name in Object.keys($slots)" :key="name" #[name]>
      <slot :name="name"></slot>
    </template>
  </el-input-number>
</template>

<script setup lang="ts" name="AppInputNumber">
  import { computed, useAttrs } from 'vue';
  import { useVModel } from '@/compositions/common';
  import { utils } from '@/utils';
  const props = defineProps({
    // v-model
    modelValue: { type: [String, Number], default: '' },
    // 组件属性
    inputProps: { type: Object, default() { return {}; } },
  });
  const attrs = useAttrs();
  const emit = defineEmits(['update:modelValue', 'on-search']);
  // 组件属性合并结果
  const inputPropsResult = computed(() => {
    return utils.deepAssign(
      {
        placeholder: '请输入',
        clearable: true,
        min: 1,
        max: 9999,
        controlsPosition: 'right',
      },
      attrs,
      props.inputProps,
    );
  });
  const { modelValueResult } = useVModel(props, emit);
</script>
<style scoped lang="scss">
  .AppInputNumber-root:deep(){ width: 100%;
    .el-input__inner{ text-align: left;}
  }
</style>
