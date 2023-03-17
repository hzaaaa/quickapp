<template>
  <!-- <button @click="count++">You clicked me {{ count }} times.</button> -->
  <div class="leftAside">


    <el-menu class="el-menu-vertical-demo" :collapse="isCollapse" :default-active="activeMenu"
      :collapse-transition="false">

      <el-menu-item v-for="(item, index) in authStore.showMenuListGet" :key="item.id"
        :index="item.childrenList && item.childrenList[0].redirect" @click="clickSubMenu(item)">
        <el-icon>
          <Setting />
        </el-icon>
        <template #title>{{ item.title }} </template>
      </el-menu-item>


    </el-menu>
    <el-row class="subLayout-aside-collapse">
      <el-icon v-if="isCollapse" @click="expandSidebar" size="large" class="pointer">
        <Expand />
      </el-icon>
      <el-icon v-else @click="foldSidebar" size="large" class="pointer ">
        <Fold />
      </el-icon>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import {
  Document,
  Menu,
  Location,
  Setting,
  Expand,
  Fold,
} from '@element-plus/icons-vue'
import { ref, computed, watch } from 'vue';
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
console.log("showMenuListGet", authStore.showMenuListGet);

//构建菜单命中数组
let routeList: any = {};
authStore.showMenuListGet.forEach(item => {
  let value = item.childrenList && item.childrenList[0].redirect;
  item.childrenList?.forEach(item2 => {
    routeList[item2.redirect || ''] = value
  })
})
console.log('routeList', routeList)
//菜单命中
let activeMenu = computed(() => {
  // debugger
  return routeList[route.path]
})




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

  router.push(menuItem.childrenList && menuItem.childrenList[0].redirect);

};
</script>

<style scoped lang="scss">
.leftAside {
  position: relative;
  border-right: 1px solid #f2f2f2;
}

.subLayout-aside-collapse {
  position: absolute;
  right: 12px;
  bottom: 12px;
  // padding-left: 20px;
  // padding-right: 20px;
}
</style>



<!-- @open="handleOpen"
      @close="handleClose" -->
      
      <!-- <el-menu-item index="2" @click="clickSubMenu">
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
      </el-menu-item> -->
