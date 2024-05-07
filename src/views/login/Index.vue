<template>
  <main class="Login-root">
    <header>
      <div class="header-in">
        <div class="logo">
          <img src="@/assets/images/logo.webp" alt="logo" />
        </div>
        <div class="txt">
          <h1>统一身份访问管理系统</h1>
        </div>
      </div>
      <AppButton type="primary" icon="Promotion" class="apply-btn" @click="$router.push('/apply')">申请租户 </AppButton>
    </header>
    <section class="container">
      <div class="in">
        <div class="thead">
          <h3>{{ tabInfo.tabName || "登录" }}</h3>
        </div>
        <!-- 账号登录 -->
        <Account v-show="tabInfo.index == 0" ref="AccountRef" @on-ok="dataInfo.showAuthPopup"></Account>
        <!-- 二维码登录 -->
        <Ewm v-show="tabInfo.index == 1" ref="EwmRef" @on-ok-tenant="dataInfo.showTenantPopup"></Ewm>
        <footer
          class="footer-type"
          :class="{
            multiple: tabInfo.index == 0 && dataInfo.hasMultipleTenant
          }"
        >
          <el-divider>
            <p>其他登录方式</p>
          </el-divider>
          <div class="btn-com">
            <AppButton v-for="item in tabInfo.listResult" :key="item.name" @click="tabInfo.tabChange({ props: { name: item.name } })">
              <AppIcon :name="item.icon"></AppIcon>
              <span>{{ item.label }}</span>
            </AppButton>
          </div>
        </footer>
      </div>
    </section>
    <!-- 二次微信认证弹窗 -->
    <SecondaryAuthEwmDialog v-model="dataInfo.showAuth" :mfaToken="dataInfo.mfaToken" :tenantId="dataInfo.tenantId"> </SecondaryAuthEwmDialog>
    <!-- 选择多租户弹窗 -->
    <SelectTenantFormDialog v-model="dataInfo.showTenant" :certToken="dataInfo.certToken" :tenantList="dataInfo.tenantList"></SelectTenantFormDialog>
  </main>
</template>

<script setup lang="ts" name="Login">
import { ref, reactive } from "vue";
import Account from "@/views/login/components/Account.vue"; // 账号登录
import Ewm from "@/views/login/components/Ewm.vue"; // 二维码登录
import SecondaryAuthEwmDialog from "@/views/login/components/SecondaryAuthEwmDialog.vue"; // 二次认证弹窗
import SelectTenantFormDialog from "@/views/login/components/SelectTenantFormDialog.vue"; // 选择多租户弹窗
// tab栏目
const tabInfo: Global.Info = reactive({
  // 列表
  list: [
    { name: 0, label: "账号登录", icon: "User" },
    { name: 1, label: "人脸识别", icon: "Iphone" }
  ],
  // tab名字
  get tabName() {
    return tabInfo.list[+tabInfo.index].label || "登录";
  },
  // 列表
  get listResult() {
    return this.list.filter((obj) => obj.name != tabInfo.index);
  },
  index: 0, // 索引值
  // 切换栏
  tabChange({ props }) {
    tabInfo.index = props.name;
    dataInfo.init();
  }
});

const AccountRef = ref(); // AccountRef
const EwmRef = ref(); // EwmRef
// 信息数据
const dataInfo: Global.Info = reactive({
  showAuth: false, // 二次认证弹窗状态
  mfaToken: "", // 二次认证token
  tenantId: "", // 租户id
  // 打开二次认证弹窗
  showAuthPopup({ mfaToken, tenantId }) {
    // console.log('mfaToken>>', mfaToken);
    dataInfo.mfaToken = mfaToken;
    dataInfo.tenantId = tenantId;
    dataInfo.showAuth = true;
  },

  showTenant: false, // 租户弹窗状态
  tenantList: [], // 租户列表
  certToken: "", // certToken
  // 打开多租户弹窗
  showTenantPopup({ certToken, tenantList }) {
    // console.log('tenantList>>', tenantList);
    dataInfo.certToken = certToken;
    dataInfo.tenantList = tenantList;
    dataInfo.showTenant = true;
  },

  get hasMultipleTenant() {
    return AccountRef.value?.dataInfo.tenantList.length > 0;
  },

  // 初始化
  init() {
    AccountRef.value?.dataInfo.init();
    EwmRef.value?.dataInfo.stop();
    tabInfo.index == 1 && EwmRef.value?.dataInfo.init();
  }
});
</script>

<style lang="scss" scoped>
@import "@/views/Login/styles/Index.scss";
</style>
