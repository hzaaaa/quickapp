<template>
  <div @click="jump">ToutiaoHome</div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const jump = () => {
  router.push("/account");
};
</script>

<style scoped lang="scss"></style>
