<!-- avatar 头像
  https://element-plus.gitee.io/zh-CN/component/avatar.html
-->
<template>
  <el-avatar v-bind="avatarPropsResult" class="AppAvatar-root">
    <img :src="defaultAvatar" />
  </el-avatar>
</template>
<script lang="ts" setup name="AppAvatar">
  import { computed, useAttrs } from 'vue';
  import { utils } from '@/utils';
  import defaultAvatar from '@img/default_avatar.png';
  const props = defineProps({
    // 组件属性
    avatarProps: { type: Object, default: () => ({}) },
  });
  const attrs = useAttrs();
  // 组件属性合并结果
  const avatarPropsResult = computed(() => {
    return utils.deepAssign(
      {
        size: 'default',
        shape: 'circle',
        fit: 'cover',
        alt: '用户头像',
        src: defaultAvatar,
      },
      attrs,
      props.avatarProps,
    );
  });
  const errorHandler = () => true; // 当图像加载错误时触发
</script>