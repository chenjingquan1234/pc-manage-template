<!-- image 图片
  https://element-plus.gitee.io/zh-CN/component/image.htm
-->
<template>
  <el-image class="AppImage-root" v-bind="imagePropsResult" :style="styles" @error="errorHandler">
    <template #error>
      <div class="image-error">
        <!-- <img :src="imgError"> -->
        <AppIcon name="Picture"></AppIcon>
      </div>
    </template>
    <!-- 插槽透传 -->
    <template v-for="name in Object.keys($slots)" #[name]>
      <slot :name="name"></slot>
    </template>
  </el-image>
</template>
<script lang="ts" setup name="AppImage">
  import { computed, useAttrs } from 'vue';
  import { utils } from '@/utils';
  const props = defineProps({
    // 组件属性
    imageProps: { type: Object, default: () => ({}) },
    // 样式
    styles: {
      type: Object, default: () => ({
        width: '100%', height: '100%',
      }),
    },
  });
  const attrs = useAttrs();
  // 组件属性合并结果
  const imagePropsResult = computed(() => {
    return utils.deepAssign(
      {
        fit: '',
        alt: '图片',
        src: '',
      },
      attrs,
      props.imageProps,
    );
  });
  const errorHandler = () => true; // 当图像加载错误时触发
</script>
<style scoped lang="scss">
  .AppImage-root{ cursor: pointer;
    .image-error{ width: 100%; height: 100%;  display: flex; justify-content: center; align-items: center;
      background: var(--el-fill-color-light); color: var(--el-text-color-secondary);  font-size: 20px;
    }
  }
</style>