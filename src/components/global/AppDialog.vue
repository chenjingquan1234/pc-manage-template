<!-- 通用弹窗
  https://element-plus.gitee.io/zh-CN/component/dialog.html
  使用示例：
  <AppDialog v-model="show1" :modalProps="{title:''}" :footerProps="footerProps1"></AppDialog>
  <AppDialog v-model="show1" v-bind="appModalProps1"></AppDialog>
 -->
<template>
  <section class="AppDialog-main">
    <teleport v-bind="teleportPropsResult">
      <el-dialog
        v-model="showModel"
        v-bind="modalPropsResult"
        :width="
          modalPropsResult?.width > width
            ? '90%'
            : modalPropsResult.width || 520
        "
      >
        <template #header>
          <slot name="header"></slot>
        </template>
        <slot></slot>
        <template #footer>
          <slot name="footer">
            <footer
              v-if="footerPropsResult.buttons.length"
              :style="footerPropsResult.styles"
            >
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
      </el-dialog>
    </teleport>
  </section>
</template>

<script setup lang="ts" name="AppDialog">
import { useAttrs, computed } from "vue";
import modal from "@/compositions/modal";
import { useWindowResize } from "@/compositions/window";
const { width } = useWindowResize();
const props = defineProps({
  // @ts-ignore
  ...modal.props,
  // 选中项，单选用
  selectedItem: { type: Object, default: () => ({}) },
  // 选中项，多选用
  selectedItems: { type: Array, default: () => [] },
});
const attrs = useAttrs();
const emit = defineEmits(["update:modelValue"]);
const {
  showModel,
  teleportPropsResult,
  modalPropsResult,
  footerPropsResult,
  buttonClick,
} = modal({ props, attrs, emit });
</script>
<style lang="scss">
.AppDialog-root {
  .el-dialog {
    border-radius: 12px;
  }
  .el-dialog__header {
    padding: 20px 28px;
    font-weight: 600;
    margin-right: 0;
    .el-dialog__headerbtn {
      width: 20px;
      height: 20px;
      right: 28px;
      top: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      .el-dialog__close {
        font-weight: bold;
        transition: all 0.3s;
        font-size: 20px;
      }
      &:hover .el-dialog__close {
        transform: rotate(180deg);
      }
    }
  }
  .el-dialog__body {
    padding: 16px 28px;
    padding-top: 4px;
  }
  .el-dialog__footer {
    padding: 16px 28px;
    border-top: 1px solid #e7e8eb;
    // .el-button{ padding: 8px 26px; }
    .el-button + .el-button {
      margin-left: 16px;
    }
  }
  .el-dialog__footer:empty {
    display: none;
  }
}
</style>
