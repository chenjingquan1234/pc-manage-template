<!-- 通用抽屉
  https://element-plus.gitee.io/zh-CN/component/drawer.html
 -->
<template>
  <teleport v-bind="teleportPropsResult">
    <el-drawer v-model="showModel" v-bind="modalPropsResult" class="AppDrawer">
      <template #header>
        <slot name="header"></slot>
      </template>
      <slot></slot>
      <template #footer>
        <slot name="footer">
          <footer v-if="footerPropsResult.buttons.length" :style="footerPropsResult.styles">
            <el-button
              v-for="(item, index) in footerPropsResult.buttons"
              :key="index"
              v-bind="item.buttonProps"
              @click="buttonClick(item)"
            >{{ item.text }}
            </el-button>
          </footer>
        </slot>
      </template>
    </el-drawer>
  </teleport>
</template>

<script setup lang="ts" name="AppDrawer">
  import { useAttrs } from 'vue';
  import modal from '@/compositions/modal';
  import { useWindowResize } from '@/compositions/window';
  const { width } = useWindowResize();
  const props = defineProps({
    // @ts-ignore
    ...modal.props,
  });
  const attrs = useAttrs();
  const emit = defineEmits(['update:modelValue']);
  const { showModel, teleportPropsResult, modalPropsResult, footerPropsResult, buttonClick } =
    modal({ props, attrs, emit });
</script>
<style lang="scss">
  .AppDrawer{
    .el-drawer__header{
      .el-drawer__title{ font-weight: 600; color: #222633;}
      .el-drawer__close-btn{
        .el-drawer__close{ font-weight: bold; transition: all 0.3s;font-size: 20px;}
        &:hover{
          .el-drawer__close{ transform: rotate(180deg);}
        }
      }
    }
  }
</style>
