<!-- select 选择器
  https://element-plus.gitee.io/zh-CN/component/select.html
-->
<template>
  <div class="AppSelect-root">
    <span v-if="extraProps?.type" v-ellipsis.title class="tit">{{ extraProps?.text }}</span>
    <el-select v-model="modelValueResult" v-bind="selectPropsResult" @change="requestInfo.selectChange" @visible-change="requestInfo.visibleChange">
      <el-option v-for="item in listResult" :key="item[`${filedProps.value}`]" :value="item[`${filedProps.value}`]" :label="item[`${filedProps.label}`]"></el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts" name="AppSelect">
  import { computed, watch, toRefs, useAttrs } from 'vue';
  import { useVModel } from '@/compositions/common';
  import { utils } from '@/utils';
  // 父组件传递的值
  interface Props {
    modelValue: string | number | boolean | Record<string, any> | any | null
    selectProps?: Record<string, any>
    list?: Global.List[],
    extraProps?: Record<string, any>
    filedProps?: Record<string, any>
    requestHandle: Function

  }
  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => '', // v-model
    list: () => [], // 多选列表
    filedProps: () => { return { value: 'id', label: 'name' }; },
  });
  const attrs = useAttrs();
  const emit = defineEmits(['update:modelValue', 'change', 'selectChange']);

  
  // 配置项是远程请求
  onMounted(() => {
    requestInfo.visibleChange(true)
  })

  const requestInfo = reactive({
    loading: false,
    requestList: [],
    async visibleChange(v) {
      console.log(v, props.list, requestInfo.requestList)
      if (v && props.requestHandle && requestInfo.requestList.length === 0) {
        try {
          requestInfo.loading = true
          const res = await props.requestHandle()
          requestInfo.loading = false
          requestInfo.requestList = res
        } catch (e) {
          requestInfo.loading = false
        }
      }
    },
    //
    selectChange(e) {
      console.log(222, e)
      emit(
        'selectChange',
        listResult.value.find((t) => t[props.filedProps.value] === e)
      )
    }
  })

  const listResult = computed(() => {
    if (requestInfo.requestList.length) return requestInfo.requestList || []
    if (props.list.length) return props.list || []
    return []
  })
    
  // 监听选择
  const { modelValue, filedProps } = toRefs(props);
  watch(modelValue, (newValues, prevValues) => {
    emit('change', newValues);
  });
  // 组件属性合并结果
  const selectPropsResult = computed(() => {
    return utils.deepAssign(
      {
        size: 'default',
        clearable: true,
      },
      attrs,
      props.selectProps,
    );
  });
  const { modelValueResult } = useVModel(props, emit);
</script>

<style scoped lang="scss">
  .AppSelect-root {
    width: 100%;
    display: flex;
    .tit{ width: 80px; line-height: 40px;}
    :deep(.el-select){ flex: auto;}
  }
</style>
