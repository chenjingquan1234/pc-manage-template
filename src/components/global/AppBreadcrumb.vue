<!-- 面包屑
默认根据左侧列表 store.state.menuList 和当前路由得到列表，也可以在slot中自行添加 el-breadcrumb-item
使用示例：
<AppBreadcrumb></AppBreadcrumb>
<AppBreadcrumb showHome>
  <el-breadcrumb-item>自定义1</el-breadcrumb-item>
  <el-breadcrumb-item>自定义2</el-breadcrumb-item>
</AppBreadcrumb>
-->
<template>
  <el-breadcrumb class="AppBreadcrumb-root" v-bind="$attrs">
    <el-breadcrumb-item v-if="showHome" :to="{ name: 'home' }">首页</el-breadcrumb-item>
    <slot>
      <el-breadcrumb-item v-for="item in listResult" :key="item.path" :to="item.to">{{ item.title }}</el-breadcrumb-item>
    </slot>
  </el-breadcrumb>
</template>
<script lang="ts" setup name="AppBreadcrumb">
  import { computed } from 'vue';
  import { useCommon } from '@/compositions/common';
  import { useMenuStore } from '@/stores/menu';
  const { proxy, route } = useCommon();
  const useMenu = useMenuStore(); // 菜单信息
  const props = defineProps({
    // 是否显示首页
    showHome: { type: Boolean, default: false },
    // 列表
    list: { type: Array, default: () => { []; } },
  });
  const emit = defineEmits(['on-list']);

  // 左侧菜单列表
  const categoryRoutesTree = computed(() => {
    return useMenu.categoryRoutesTree || [];
  });
  // 处理项
  function setItem(item) {
    item.allQuery = route.query;
    const actions = new Map([
      ['default', () => { item; }],
    ]);
    const specialPaths = ['/label/list', '/label/list/users', '/label/list/strategy'] as string[];
    item.to = { path: item.path, query: !specialPaths.includes(item.path) ? item.query : item.allQuery };
    const action = actions.get(item.path) || actions.get('default');
    action && action.call(proxy);
  }

  // 获取列表
  function getList(list) {
    let result:Global.Info = [];
    for (const item of list) {
      setItem(item);
      // 找到当前路由匹配项退出循环
      if (item.path === route.path) {
        result.push(item);
        break;
      }
      // 还没到的递归进去，有找到再退出循环
      const arr:any = (item.children || []).length > 0 && getList(item.children) || [];
      if (arr.length > 0) {
        result.push(item, ...arr);
        break;
      }
    }
    return result;
  }

  // 列表
  const listData:Global.Info = computed(() => {
    const list = getList(categoryRoutesTree.value) || [];
    list.forEach((item, i, array) => {
      const [last] = [...array].reverse(); // 置空最后一项不可点击
      last.to = '';
    });
    emit('on-list', list);
    return list;
  });

  // 列表结果
  const listResult:Global.Info = computed(() => {
    return (props.list || []).length<=0 ? listData.value : props.list;
  });
</script>
<style scoped lang="scss">
  .AppBreadcrumb-root{ height: 56px; padding:0 24px; background-color: #fff; border-bottom: 1px solid #DFE0E2; display: flex; align-items: center; flex: none; font-size: 16px;
    :deep(.el-breadcrumb__item){
      .el-breadcrumb__separator{ font-weight: normal;}
      .el-breadcrumb__inner{ color: #A7A8AD;
        &.is-link , a{ font-weight: normal !important; transition: all .2s;
          &:hover{ color: var(--el-color-primary);}
        }
      }
      &:last-of-type{
        .el-breadcrumb__inner{ color: var(--el-text-color-primary);}
      }
    }
  }
</style>
