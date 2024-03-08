<!-- 多选 checkbox
  https://element-plus.gitee.io/zh-CN/component/checkbox.html
-->
<template>
  <el-checkbox-group v-model="modelValueResult" v-bind="checkGroupPropsResult" class="AppCheckGroup-root">
    <slot>
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id" :disabled="disabled?.includes(item.id)">{{ item.name }}</el-checkbox>
    </slot>
  </el-checkbox-group>
</template>
<script setup lang="ts" name="AppCheckGroup">
  import { computed, watch, toRefs, useAttrs } from 'vue';
  import { useVModel } from '@/compositions/common';
  import { utils } from '@/utils';
  // 父组件传递的值
  interface Props {
    modelValue?: any
    checkGroupProps?: Record<string, any>
    list?: Global.List[]
    disabled?: any[]
    checkboxProps?: any
  }
  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [], // v-model
    list: () => [], // 多选列表
  });
  const { modelValue } = toRefs(props);
  const attrs = useAttrs();
  const emit = defineEmits(['update:modelValue', 'change']);
  // 组件属性合并结果
  const checkGroupPropsResult = computed(() => {
    return utils.deepAssign(
      {
        type: 'default',
      },
      attrs,
      props.checkGroupProps,
    );
  });
  const { modelValueResult } = useVModel(props, emit);
  // 监听选择
  watch(modelValue, (newValues, prevValues) => {
    emit('change', newValues);
  });
</script>
<style scoped lang="scss">
</style>
