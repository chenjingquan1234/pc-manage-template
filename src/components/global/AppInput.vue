<!-- input 输入框
  https://element-plus.gitee.io/zh-CN/component/input.html
-->
<template>
  <el-input v-model="modelValueResult" v-bind="inputPropsResult" class="AppInput-root">
    <!-- 默认显示的插槽 -->
    <template v-if="iconProps.place == 'prefix' && iconProps.name" #prefix>
      <AppIcon class="el-input__icon" :name="iconProps.name"></AppIcon>
    </template>
    <template v-if="iconProps.place == 'suffix' && iconProps.name" #suffix>
      <AppIcon v-if="iconProps.name == 'Search'" name="Search" @click="$emit('on-search')"></AppIcon>
      <AppIcon v-else class="el-input__icon" :name="iconProps.name"></AppIcon>
    </template>
    <!-- 插槽透传 -->
    <template v-for="name in Object.keys($slots)" :key="name" #[name]>
      <slot :name="name"></slot>
    </template>
  </el-input>
</template>

<script setup lang="ts" name="AppInput">
  import { computed, useAttrs } from 'vue';
  import { useVModel } from '@/compositions/common';
  import { utils } from '@/utils';
  const props = defineProps({
    // v-model
    modelValue: { type: [String, Number], default: '' },
    // 组件属性
    inputProps: { type: Object, default() { return {}; } },
    // 图标选项
    iconProps: { type: Object, default() { return { place: '', name: '' }; } },
  });
  const attrs = useAttrs();
  const emit = defineEmits(['update:modelValue', 'on-search']);
  // 组件属性合并结果
  const inputPropsResult = computed(() => {
    return utils.deepAssign(
      {
        placeholder: '请输入',
        clearable: true,
        size: 'default',
        get showPassword() {
          return this.type === 'password';
        },
      },
      attrs,
      props.inputProps,
    );
  });
  const { modelValueResult } = useVModel(props, emit);
</script>
<style scoped lang="scss">
  .AppInput-root{
    :deep(.el-input__suffix){ cursor: pointer;}
  }
</style>
