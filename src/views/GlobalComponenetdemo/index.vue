<template>
  <div class="component-demo-root">
    <AppButton ></AppButton>
    
  </div>
</template>

<script setup lang="ts">
import $api from "@/apis";
import $util from "@/utils";
import { ref } from "vue";

onMounted(() => {
  $util.desensitizeUtil.desensitizeValue
  $api.password.checkWiiPassword
})
</script>

<style lang="scss" scoped>
.component-demo-root {
  display: flex;
  flex-direction: column;
}
</style>
