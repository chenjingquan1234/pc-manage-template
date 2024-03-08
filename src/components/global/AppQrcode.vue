<!-- qrcode二维码生成组件
  https://github.com/scopewu/qrcode.vue/blob/main/README-zh_cn.md
-->
<template>
  <qrcode-vue v-bind="qrcodePropsResult" />
</template>
<script lang="ts" setup name="AppQrcode">
  import QrcodeVue from 'qrcode.vue';
  import { useAttrs, computed } from 'vue';
  import { utils } from '@/utils';
  const props = defineProps({
    // 组件属性
    qrcodeProps: { type: Object, default() { return {}; } },
  });
  const attrs = useAttrs();
  // 组件属性合并结果
  const qrcodePropsResult = computed(() => {
    return utils.deepAssign(
      {
        class: 'AppQrcode-root',
        value: '',
        size: 100,
        level: 'H',
        margin: 0,
      },
      attrs,
      props.qrcodeProps,
    );
  });
  </script>