<template>
  <div v-scrollbar class="AppMenu-root" :class="{ 'collapse': isCollapse }">

    <AppTooltip popper-class="collapse-popper" :content="isCollapse ? '展开侧边栏' : '隐藏侧边栏'"  placement="bottom" :hide-after="0" :offset="5">
      <AppButton class="collapse-btn" circle :icon="isCollapse ? ArrowRight : ArrowLeft" @click="changeCollapse"></AppButton>
    </AppTooltip>
    <el-menu
      :default-active="activePath"
      mode="vertical"
      :collapse="isCollapse"
      :ellipsis="false"
      :router="false"
      :collapse-transition="false"
      @select="handleMenu"
    >
      <AppMenuItems :list="menuList"></AppMenuItems>
    </el-menu>
  </div>
</template>

<script setup lang="ts" name="AppMenu">
  import { ref, computed } from 'vue';
  import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
  import { useCommon } from '@/compositions/common';
  import { useMenuStore } from '@/stores/menu';
  import { utils } from '@/utils';
  const { route, router } = useCommon();
  const useMenu = useMenuStore();
  const isCollapse = ref(false);
  const changeCollapse = () => {
    isCollapse.value = !isCollapse.value;
  };
  // 左侧菜单列表
  const menuList = computed(() => {
    const transformedList = mergeAndTransform(useMenu.menuTree, { mergePaths: ['/flow', '/taskMy'], newPath: '/approval', newTitle: '审批管理', key: '9998', icon: 'View' });
    // 排序一下
    const result = transformedList.sort((a, b) => parseInt(a.key) - parseInt(b.key));
    return result || [];
  });

  // 切换菜单-跳转页面
  const handleMenu = (key: string, keyPath: string[]) => {
    router.push({ path: key });
  };
  // 标显菜单页
  const activePath = computed(() => {
    const actions = {
      '/label/list': '/label',
      '/label/list/users': '/label',
      '/label/list/strategy': '/label',
      '/applied/detail': '/applied',
      '/applied/detail/roles/detail': '/applied',
      '/permissions/update': '/permissions',
      '/form/build': '/form',
      'default': route.path,
    };
    return actions[route.path] || actions['default'];
  });

  // 合并指定的菜单项, 特殊处理
  function mergeAndTransform(arr, options) {
    const { mergePaths, newPath, newTitle, key, icon } = options;
    const mergedItems = arr.filter(item => mergePaths.includes(item.path));
    if (mergedItems.length > 1) {
      const mergedKeys = key || mergedItems.map(item => item.key).join('-');
      const newChildren = mergedItems.map(item => ({ ...item, key: item.key }));
      arr = arr.filter(item => !mergePaths.includes(item.path));
      arr.push({
        key: mergedKeys,
        path: newPath,
        title: newTitle,
        icon: icon || 'View',
        children: newChildren,
      });
    }
    return arr;
  }
</script>

<style lang="scss" scoped>
  .AppMenu-root{ width: 240px; height: calc(100vh - 60px); background-color: #fff; flex: none; transition: width 0.2s;
     position: relative;
    .collapse-btn{  border: 0.5px solid #eeeff1; position: absolute; right: -16px; top: 50%; transform: translateY(-50%); z-index: 1;
      &:hover,&:focus{ background-color: var(--el-button-bg-color); color: var(--el-button-text-color);  border-color: #eeeff1; }
    }
    &.collapse{ width: calc( var(--el-menu-icon-width) + var(--el-menu-base-level-padding) * 2 );}
    :deep(.el-menu){ height: 100%; border: none;  overflow-x: hidden; overflow-y: auto;
      .el-sub-menu__title{
        &::after{ opacity: 0; height: 0;}
        .ico{ width: 16px; margin-right: 5px;}
      }
    .el-menu-item{ line-height: 48px; border-bottom: none; position: relative;
      .ico{ width: 16px; margin-right: 5px;}
      &::before{ content: ''; width: 4px; height: 30px; background: var(--el-color-primary);border-radius: 0px 100px 100px 0px;
        position: absolute; left: 0; top: 50%; transform: translateY(-50%); opacity: 0;
      }
      &.is-active{
        &::before{ opacity: 1;}
        .ico{
          filter: drop-shadow(var(--el-color-primary) 80px 0); transform: translateX(-80px);
        }
      }
    }
    .el-sub-menu{
        &.is-active{
          .el-sub-menu__title{ border-bottom: none; position: relative;
              &::after{ content: ''; width: 28px; height: 4px; background-color: var(--el-color-primary); border-radius: 1px;
            position: absolute; bottom: 0; left: 40%; transform: translateX(-50%); }
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  .collapse-popper{
    background-color: rgba(0,0,0,.5) !important; border: none !important;
    .el-popper__arrow{ opacity: 0;
      &::before{  background-color: rgba(0,0,0,.5) !important; border: none !important;}
    }
  }
</style>
