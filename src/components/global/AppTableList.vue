<template>
  <div v-scrollbar class="AppTableList-root">
    <slot></slot>
  </div>
</template>
<script name="AppTableList">
  export default {
    name: 'AppTableList',
    components: {},
    setup(props, context) {
      return {};
    },
  };
</script>
<style lang="scss">
  .AppTableList-wrap{display: flex;flex-direction: column;
    .AppTableList-root{flex: 1;overflow-y: auto;}
  }
</style>
<style scoped lang="scss">
  .AppTableList-root{ padding: 0 24px;}
  .AppTableList-root :deep(){
    display: flex;flex-direction: column;
    padding: 0 24px;background: #fff;
    .AppTableList-root, .AppPager-root{padding: 15px 0;}
    .AppTable-root{flex: 1;}
    .footer{ width: 100%; padding: 15px 0; display: flex; justify-content: space-between;
      .AppPager-root{ padding: 0 !important;}
    }
  }
</style>
