<!-- tooltip 文字提示
  https://element-plus.gitee.io/zh-CN/component/tooltip.html
-->
<template>
  <el-tooltip v-bind="tooltipPropsReslut" ref="AppTooltipRef">
    <template #content>
      <div v-scrollbar class="content" v-html="content"></div>
    </template>
    <template v-if="extraPropsReslut.type == 'ellipsis'">
      <div v-ellipsis="extraPropsReslut.num" class="ti">{{ content || '-'  }}</div>
    </template>
    <template v-else-if="extraPropsReslut.type == 'explain'">
      <span class="explain-ti">{{ extraPropsReslut.name || '说明' }}<AppIcon name="WarningFilled"></AppIcon></span>
    </template>
    <!-- 各插槽中转 -->
    <template v-for="name in Object.keys($slots)" #[name]>
      <slot :name="name"></slot>
    </template>
  </el-tooltip>
</template>
<script lang="ts" setup name="AppTooltip">
  import { computed, useAttrs } from 'vue';
  import { utils } from '@/utils';
  const props = defineProps({
    // 文字内容
    content: { type: [Number, String] },
    // tooltip组件属性
    tooltipProps: { type: Object, default() { return {}; } },
    // 额外
    extraProps: { type: Object, default() { return {}; } },
  });
  const attrs = useAttrs();
  // 组件属性合并结果
  const tooltipPropsReslut = computed(() => {
    return utils.deepAssign(
      {
        'popper-class': 'AppTooltip-root',
        placement: 'top',
        effect: 'dark',
        disabled: props.content ? false : true,
      },
      attrs,
      props.tooltipProps,
    );
  });
  // 额外传参合并结果
  const extraPropsReslut = computed(() => {
    return utils.deepAssign(
      {
        type: 'ellipsis',
        num: 2,
      },
      props.extraProps,
    );
  });
</script>
<style lang="scss">
  .AppTooltip-root{ max-width: 300px;
    .content{ max-height:200px; line-height: 1.8; overflow-y: auto; }
  }
</style>