<template>
  <div class="home">
    <!-- 顶部信息栏 -->
    <header class="header">
      <!-- 顶部信息栏-标题 -->
      <div class="header-title" @click="temp">快应用投放配置管理系统</div>
      <!-- 顶部信息栏-一级菜单 -->
      <div class="header-directory">
        <div
          v-for="(item, index) in authStore.showMenuListGet"
          :key="item.id"
          @click="changeMenu(item, index)"
          :class="{ active: activeMenuPath === item.redirect }"
        >
          {{ item.title }}
        </div>
      </div>
      <!-- 顶部信息栏-用户信息 -->
      <div class="header-userinfo">
        <el-dropdown>
          <span class="header-userinfo-dropdown_title">
            <img :src="avatar" alt="" />
            <p>{{ globalStore.username }}（{{ globalStore.role }}）</p>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled v-if="globalStore.email">{{ globalStore.email }}</el-dropdown-item>
              <el-dropdown-item divided @click="jumpToInfo">个人信息设置</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <!-- 主体部分 -->
    <div class="body">
      <!-- 主体部分-左侧导航栏-->
      <!-- <aside class="aside"></aside>  -->
      
      <!-- 主体部分-内容 -->
      <div class="container">
        <leftAside></leftAside>
        <div class="right-container">
        <RouterView></RouterView>
      </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import avatar from "@/assets/images/avatar.png";
import { logoutApi } from "@/api/login/login";
import { useRoute, useRouter } from "vue-router";
import { useGlobalStore } from "@/store";
import { useAuthStore } from "@/store/auth";
import { getFisrtRoute } from "@/utils/util";

// import subLayout from './subLayout.vue'
import leftAside from './leftAside.vue'

const route = useRoute();
const router = useRouter();
const globalStore = useGlobalStore();
const authStore = useAuthStore();
const temp = () => {
  console.log("routes", authStore.authMenuListGet);
  // console.log("routerMenuListGet", authStore.routerMenuListGet);
  console.log("showMenuListGet", authStore.showMenuListGet);
  console.log("curRoute", route);
};
/**
 * 主菜单跳转
 */
const activeMenuPath = ref("");
onMounted(() => {
  activeMenuPath.value = route.matched[0].path;
});
const changeMenu = (targetMenu: any, targetMenuIndex: number) => {
  activeMenuPath.value = targetMenu.redirect;
  let routes = authStore.authMenuListGet[targetMenuIndex];
  router.push(getFisrtRoute(routes));
};

/**
 * 顶部信息栏-用户信息
 */
const jumpToInfo = () => {
  activeMenuPath.value = "";
  router.push("/info");
};
const logout = () => {
  ElMessageBox.confirm("确认退出吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async () => {
      // 1. 调用退出登录接口
      await logoutApi();
      // 2. 清除 token 等缓存
      globalStore.$reset();
      localStorage.clear();
      // document.cookie = "";
      // 3. 重定向到登录页,并携带当前页面地址和参数
      const path = `/login?redirect=${route.path}&params=${JSON.stringify(route.query ? route.query : route.params)}`;
      router.replace(path);
      ElMessage.success("退出登录成功！");
    })
    .catch(() => {});
};
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  min-width: 1200px;
  height: 100%;
}
.header {
  display: flex;
  align-items: center;
  border-bottom: 4px #f2f2f2 solid;
  height: 60px;
  &-title {
    box-sizing: border-box;
    padding-left: 16px;
    width: 250px;
    font-size: 20px;
  }
  &-directory {
    display: flex;
    flex: 1;
    padding-left: 40px;
    div {
      width: 120px;
      height: 60px;
      cursor: pointer;
      line-height: 60px;
      text-align: center;
      &.active {
        position: relative;
        color: var(--el-color-primary);
        &::before {
          position: absolute;
          left: 40px;
          bottom: 0;
          border-radius: 2px;
          width: 40px;
          height: 3px;
          background-color: var(--el-color-primary);
          content: "";
          transition: all 0.5s ease-out;
        }
      }
    }
  }
  &-userinfo {
    margin-right: 40px;
    &-dropdown_title {
      display: flex;
      align-items: center;
      img {
        margin-right: 8px;
        width: 32px;
      }
    }
  }
}
.body {
  overflow-y: auto;
  flex-grow: 1;
  width: 100%;
  .container {
    display: flex;
    overflow-y: hidden;
    // flex-direction: column;
    width: 100%;
    height: 100%;
    .right-container{
      padding: 12px;
      padding-bottom: 0;
      flex: 1;
      width: 0;
    }
  }
}
</style>
