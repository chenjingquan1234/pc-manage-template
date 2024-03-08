<!-- switch 开关
  https://element-plus.gitee.io/zh-CN/component/switch.html
-->
<template>
  <el-switch v-model="modelValueResult" v-bind="switchPropsResult" class="AppSwitch-root"></el-switch>
</template>

<script setup lang="ts" name="AppSwitch">
  import { computed, useAttrs, toRefs, watch } from 'vue';
  import { useVModel } from '@/compositions/common';
  import { utils } from '@/utils';
  // 父组件传递的值
  interface Props {
    modelValue: boolean | string | number
    switchProps?: Record<string, any>
  }
  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => false, // v-model
  });
  const attrs = useAttrs();
  const emit = defineEmits(['update:modelValue', 'change']);
  // 监听选择
  const { modelValue } = toRefs(props);
  watch(modelValue, (newValues, prevValues) => {
    emit('change', newValues);
  });
  // 组件属性合并结果
  const switchPropsResult = computed(() => {
    return utils.deepAssign(
      {
        disabled: false,
      },
      attrs,
      props.switchProps,
    );
  });
  const { modelValueResult } = useVModel(props, emit);
</script>

<style scoped lang="scss">
</style>
