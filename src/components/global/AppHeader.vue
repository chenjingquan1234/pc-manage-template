<template>
  <header class="AppHeader-root">
    <div class="in">
      <aside class="left-mol" @click="$router.push('/')">
        <div class="left-logo">
          <img src="@/assets/images/iam-logo.webp" alt="logo" />
        </div>
        <div class="txt">
          <h1>统一身份访问管理系统</h1>
        </div>
      </aside>
      <aside class="right-mol">
        <div class="th">
          <span class="ti-name">{{ userInfo.tenantName || '' }}</span>
          <i class="line"></i>
        </div>
        <el-dropdown @visible-change="dataInfo.handleToggle">
          <div class="drop-content">
            <AppAvatar :size="32" alt="头像"></AppAvatar>
            <h2>
              <p>{{ userInfo.userName || '-' }}</p>
              <AppTag size="small">{{ userInfo.systemAdmin ? '系统管理员' : '平台用户' }}</AppTag>
            </h2>
            <AppIcon :name="dataInfo.isOpen ? 'ArrowUp' : 'ArrowDown'"></AppIcon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push({ path: '/desk' })"><AppIcon name="Switch"></AppIcon>职员工作台</el-dropdown-item>
              <el-dropdown-item @click="dataInfo.show = true"><AppIcon name="User"></AppIcon>个人中心</el-dropdown-item>
              <el-dropdown-item  @click="dataInfo.logout()"><AppIcon name="SwitchButton"></AppIcon>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </aside>
    </div>
  </header>
  <!-- 个人中心弹窗页 -->
  <MyInfoDrawer v-model="dataInfo.show" :userInfo="dataInfo.userInfo"></MyInfoDrawer>
</template>

<script setup lang="ts" name="AppHeader">
  import { toRefs, reactive, onMounted } from 'vue';
  import { useLoginStore } from '@/stores/login';
  import { useMineStore } from '@/stores/mine';
  import utils from '@/utils';
  import MyInfoDrawer from '@/views/index/components/MyInfoDrawer.vue'; // 个人中心弹窗页
  const store = useLoginStore();
  // 个人信息
  const useMine = useMineStore();
  // 信息数据
  const dataInfo:Global.Info = reactive({
    get userInfo() {
      return useMine.userInfo || {};
    },
    isOpen: false, // 下拉框显示状态
    // 下拉框切换
    handleToggle(val:boolean) {
      dataInfo.isOpen = val;
    },
    show: false, // 个人中心弹窗状态
    // 退出登录
    async logout() {
      try {
        const ok = await utils.messageCofirm('您确定要退出登录吗?');
        if (ok) {
          await store.logoutAction();
          useMine.$reset();
        }
      } catch (error) {}
    },
  });
  const { userInfo } = toRefs(dataInfo);
</script>

<style lang="scss" scoped>
  .AppHeader-root{ height: 60px; display: flex; position: relative; z-index: 1000; background-color: #fff; border-bottom: 1px solid #f0f0f0;
    .in{ height: 60px; background: #fff;  flex: 1; display: flex; justify-content: space-between; padding: 0 24px;
      .left-mol{ min-width: 220px; height: 100%; display: flex; align-items: center;  cursor: pointer; transition: all .2s;
        &:hover{ opacity: 0.95;}
        .left-logo{
          img{ height: 36px; }
        }
        .txt{ margin-left: 8px;
          h1{ font-size: 16px; font-weight: 700;}
        }
      }
    .right-mol{ display: flex; align-items: center;  overflow: hidden; margin-left: 15px;
        .th{ display: flex; align-items: center; max-width: 300px; font-size: 16px; color: #222633; padding-right: 5px;
          .ti-name{
            text-overflow: ellipsis; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
            word-break: break-all; line-height: 1.2; transition: all .2s; margin-right: 4px;
          }
          .line{ width: 1px; height: 12px; background-color: #CCCFCC; margin: 20px;}
        }
        .el-dropdown{
          .drop-content{ display: flex; align-items: center; cursor: pointer;
            h2{ font-size: 14px; margin-right: 8px;
              .AppTag-root{ margin-top: 2px;}
            }
            &:focus-visible{ outline: none;}
          }
          .pic{ width: 38px; height: 38px; border-radius: 100%; overflow: hidden; margin-right: 10px;
            display: inline-flex; justify-content: center; align-items: center; box-sizing: border-box;  text-align: center;
            img{ width: 100%; }
          }
          .AppAvatar-root{ margin-right: 10px; }

          .content-list{ width: 200px;
            li{ white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .drop-content-list{ width: 200px; max-height: 300px;
    li{ width: 100%; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      &.active{ color: var(--el-color-primary);}
    }
  }
</style>