<!-- 导航菜单items
样式在 AppMenu 中统一处理，当前组件只用于数据递归
-->
<template>
  <template v-for="item in list" :key="item.id">
    <el-menu-item v-if="(item.children || []).length <= 0" :index="item.path">
      <AppIcon v-if="item.icon" class="ico" :name="item.icon" />
      <template #title><span>{{ item.title }}</span></template>
    </el-menu-item>
    <el-sub-menu v-else :index="item.path" popper-class="menu-popper">
      <template #title>
        <AppIcon v-if="item.icon" class="ico" :name="item.icon" />
        <span>{{ item.title }}</span>
      </template>
      <AppMenuItems :list="item.children"></AppMenuItems>
    </el-sub-menu>
  </template>
</template>
<script setup lang="ts" name="AppMenuItems">
  // 父组件传递的值
  interface Props {
    list?: Global.Info[]
  }
  const props = withDefaults(defineProps<Props>(), {
    list: () => [], // 菜单列表
  });
</script>
<style lang="scss">
  .menu-popper{
    .el-menu--popup{ min-width: 114px; padding: 8px; border-radius: 8px;
      .el-menu-item{ border-radius: 4px; justify-content: center; }
    }
  }
</style>
