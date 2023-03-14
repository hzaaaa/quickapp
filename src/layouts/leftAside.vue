<template>
  <!-- <button @click="count++">You clicked me {{ count }} times.</button> -->
  <div class="leftAside">

  
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      
    >
    <!-- @open="handleOpen"
      @close="handleClose" -->
      
      <el-menu-item index="2" @click="clickSubMenu">
        <el-icon><Menu  /></el-icon>
        <template #title>配置快应用</template>
      </el-menu-item>
      <el-menu-item index="3" >
        <el-icon><document /></el-icon>
        <template #title>查看投放数据</template>
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><setting /></el-icon>
        <template #title>媒体标识管理</template>
      </el-menu-item>
      <el-menu-item index="5">
        <el-icon><setting /></el-icon>
        <template #title>运营主体配置 </template>
      </el-menu-item>
      <el-menu-item index="6">
        <el-icon><setting /></el-icon>
        <template #title>意见反馈汇总 </template>
      </el-menu-item>
      
      <el-sub-menu index="7">
        <template #title>
          <el-icon><location /></el-icon>
          <span>用户角色管理</span>
        </template>
        
        <el-menu-item index="7-1">人员管理</el-menu-item>
        <el-menu-item index="7-2">角色管理</el-menu-item>
        
        
      </el-sub-menu>
    </el-menu>
    <el-row class="subLayout-aside-collapse">
      <el-icon v-if="isCollapse" @click="expandSidebar" size="large" class="pointer center"><Expand /></el-icon>
      <el-icon v-else @click="foldSidebar" size="large" class="pointer "><Fold /></el-icon>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import {
  Document,
  Menu ,
  Location,
  Setting,
  Expand,
  Fold,
} from '@element-plus/icons-vue'
import { ref } from 'vue';
// import {  } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
// const temp = () => {
//   console.log("authMenuListGet", authStore.authMenuListGet);
//   console.log("showMenuListGet", authStore.showMenuListGet);
//   console.log("routerMenuListGet", authStore.routerMenuListGet);
// };

/**
 * 左侧列表
 */
// 左侧列表是否收起
const isCollapse = ref(false);
const expandSidebar = () => {
  isCollapse.value = false;
};
const foldSidebar = () => {


  isCollapse.value = true;
};
const clickSubMenu = (menuItem: any) => {
  // console.log("clickSubMenu", menuItem);
  // router.push(menuItem.index);
  router.push('/configQuickApp');

};
</script>

<style scoped lang="scss">
.leftAside{
  position: relative;
}
.subLayout-aside-collapse{
  position: absolute;
  right: 12px;
  bottom: 12px;
  // padding-left: 20px;
  // padding-right: 20px;
}
</style>

