<template>
  <div @click="jump">ReportHome</div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const jump = () => {
  router.push("/account/toutiao");
};
</script>

<style scoped lang="scss"></style>
