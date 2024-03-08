<!-- 单选 radio
 https://element-plus.gitee.io/zh-CN/component/radio.html
-->
<template>
  <el-radio-group v-model="modelValueResult" v-bind="radioGroupPropsResult" class="AppRadioGroup-root">
    <el-radio v-for="item in list" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
  </el-radio-group>
</template>
<script setup lang="ts" name="AppRadioGroup">
  import { computed, watch, toRefs, useAttrs } from 'vue';
  import { useVModel } from '@/compositions/common';
  import { utils } from '@/utils';
  // 父组件传递的值
  interface Props {
    modelValue: string | number
    radioGroupProps?: Record<string, any>
    list: Global.List[]
  }
  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => '', // v-model
    list: () => [], // 单选列表
  });
  const { modelValue, radioGroupProps } = toRefs(props);
  const attrs = useAttrs();
  const emit = defineEmits(['update:modelValue', 'change']);
  // 组件属性合并结果
  const radioGroupPropsResult = computed(() => {
    return utils.deepAssign(
      {
        type: 'default',
      },
      attrs,
      radioGroupProps,
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
