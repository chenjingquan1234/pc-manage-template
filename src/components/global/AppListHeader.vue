<template>
  <header class="AppListHeader-root">
    <slot></slot>
  </header>
</template>
<script name="AppListHeader">
  export default {
    name: 'AppListHeader',
    setup(props, context) {
      return {};
    },
  };
</script>
<style scoped lang="scss">
  .AppListHeader-root :deep(){ padding: 16px 0 5px 0; position: relative; display: flex;justify-content: space-between;
    .header-search{ flex: 1;
      &>*{ margin-right: 12px;}
      .el-col{ margin-bottom: 10px;
        .el-select:only-child{display: block;}
      }
    }
    .header-handle{
      .AppButton-root{ margin-left:16px; margin-bottom: 10px;}
    }
  }
</style>
