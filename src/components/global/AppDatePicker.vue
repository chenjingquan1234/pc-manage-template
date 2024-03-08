<!-- date-picker 日期选择器
  https://element-plus.gitee.io/zh-CN/component/date-picker.html
 -->
<template>
  <div class="AppDatePicker-root">
    <span v-if="extraProps.type == 'title'" class="tit">{{ extraProps.name || '选择日期：' }}</span>
    <AppSelect v-else-if="extraProps.type == 'select'" v-model="selectModelValueResult" :optionsList="extraProps.optionsList || []"></AppSelect>
    <el-date-picker v-model="modelValueResult" v-bind="datePickerPropsResult"></el-date-picker>
  </div>
</template>
<script setup lang="ts" name="AppDatePicker">
  import { computed, toRefs, watch, useAttrs } from 'vue';
  import { useVModel } from '@/compositions/common.js';
  import { utils } from '@/utils';
  const props = defineProps({
    // v-model
    modelValue: { type: [String, Array], default: '' },
    // 下拉值
    selectModelValue: { type: [Number, String], default() { return null; } },
    // 组件属性
    datePickerProps: { type: Object, default() { return {}; } },
    // 日期组件-额外的左侧
    extraProps: { type: Object, default() { return {}; } },
  });
  const attrs = useAttrs();
  const emit = defineEmits(['update:modelValue', 'update:selectModelValue', 'change', 'change-select']);
  const { modelValue, selectModelValue } = toRefs(props);
  // 监听选择-日期
  watch(modelValue, (newValues, prevValues) => {
    emit('change', newValues);
  });
  // 监听选择-下拉选择器
  watch(selectModelValue, (newValues, prevValues) => {
    emit('change-select', newValues);
  });
  // 组件属性结果
  const datePickerPropsResult = computed(() => {
    return utils.deepAssign(
      {
        type: 'datetimerange',
        placeholder: '请选择日期',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        teleported: true,
      },
      attrs,
      props.datePickerProps,
    );
  });
  const { modelValueResult } = useVModel(props, emit);
  const { modelValueResult: selectModelValueResult } = useVModel(props, emit, { modelValue: 'selectModelValue' });
</script>
<style scoped lang="scss">
  .AppDatePicker-root{ width: 100%; display: flex;
    .tit{  width: 80px; line-height: 40px;}
    :deep(.el-date-editor){ flex: auto;}
    :deep(.AppSelect-root){ width: 140px;
      .el-input__wrapper{ border-right: 0; margin-right: -2px; border-radius: var(--el-input-border-radius) 0  0 var(--el-border-radius-base);}
    }
  }
</style>
