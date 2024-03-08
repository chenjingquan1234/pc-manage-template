<!-- pagination 分页器
  https://element-plus.gitee.io/zh-CN/component/pagination.html
-->
<template>
  <el-pagination
    v-model:pageSize="pageSizeModel"
    v-model:currentPage="pageIndexModel"
    class="AppPager-root"
    v-bind="paginationPropsResult"
    :total="total"
  >
  </el-pagination>
</template>
<script lang="ts" setup name="AppPager">
  import { computed, watch, toRefs, useAttrs } from 'vue';
  import { useVModel } from '@/compositions/common';
  import { utils } from '@/utils';
  const props = defineProps({
    // 组件属性
    paginationProps: { type: Object, default() { return {}; } },
    // v-model:pageSize
    pageSize: { type: Number, default: 10 },
    // v-model:pageIndex
    pageIndex: { type: Number, default: 1 },
    // 总数
    total: { type: Number, default: 0 },
    // 是否小型分页
    small: { type: Boolean, default: false },
  });
  const attrs = useAttrs();
  const emit = defineEmits(['change', 'update:pageSize', 'update:pageIndex']);
  const { pageSize, pageIndex, total, small } = toRefs(props);
  // 布局显示结果
  const layoutResult = computed(() => {
    let layout = 'prev,pager,next,sizes,jumper,->,total';
    layout = total.value > pageSize.value ? layout : 'prev,pager,next,sizes,->,total';
    layout = !small.value ? layout : layout.replace('sizes,', '');
    return layout;
  });
  // 间距
  const distance = !small.value ? '10px' : '5px';
  // 在watch中触发change解决需要nextTick和改变pageSize可能引起pageIndex导致多触发一次的问题
  watch([pageSize, pageIndex], (newValues, prevValues) => {
    // 判断pageIndex会变时交给下一个watch触发
    const maxPageIndex = Math.ceil(total.value / newValues[0]);
    if (newValues[1] > maxPageIndex) { return; }
    emit('change');
  });
  const { modelValueResult: pageSizeModel } = useVModel(props, emit, { modelValue: 'pageSize' });
  const { modelValueResult: pageIndexModel } = useVModel(props, emit, { modelValue: 'pageIndex' });
  // 组件属性合并结果
  const paginationPropsResult = computed(() => {
    return utils.deepAssign(
      {
        background: false,
        pageSizes: [10, 20, 30, 40, 50, 80, 100],
        layout: layoutResult.value,
        small: small.value,
      },
      attrs,
      props.paginationProps,
    );
  });
</script>

<style lang="scss">
  .AppPager-root{
    &.el-pagination--small{
      .el-pagination__jump{ margin-left: 8px !important;}
    }
  }
</style>
<style scoped lang="scss">
  .AppPager-root :deep(){ padding: 15px 0; justify-content: flex-end;
    .el-pagination__jump{ margin: 0;}
    :deep(.el-pagination__jump){
      margin-left: v-bind(distance);
    }
    .el-pagination__sizes{ margin-left: 5px; }
    .el-pagination__jump{ margin-left: 10px; }
    .el-pagination__rightwrapper{ flex: none; }
  }
</style>
