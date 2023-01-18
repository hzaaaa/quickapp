<template>
  <div class="aside">
    <div class="aside-left">
      <el-button>创建</el-button>
      <el-input></el-input>
      <div>subLayoutHead</div>
    </div>
    <div class="aside-right">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.aside {
  display: flex;
  &-left {
    border-right: 4px #f2f2f2 solid;
    width: 200px;
  }
  &-right {
    padding: 12px 12px 0;
  }
}
</style>
