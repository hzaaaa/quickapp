<template>
  <div class="home">
    <!-- 顶部信息栏 -->
    <header class="header">
      <!-- 顶部信息栏-标题 -->
      <div class="header-title">广告素材后台</div>
      <!-- 顶部信息栏-一级菜单 -->
      <div class="header-directory">
        <span>素材库</span>
        <span>报表</span>
        <span>账户</span>
      </div>
      <!-- 顶部信息栏-用户信息 -->
      <div class="header-userinfo">
        <el-dropdown>
          <span class="header-userinfo-dropdown_title">
            <img :src="avatar" alt="" />
            <p>xx(角色)</p>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled>xx@weiyankeji.cn</el-dropdown-item>
              <el-dropdown-item divided @click="logout">个人信息设置</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <!-- 主体部分 -->
    <div class="body">
      <!-- 主体部分-左侧导航栏 -->
      <aside class="aside"></aside>
      <!-- 主体部分-内容 -->
      <div class="container">
        <RouterView></RouterView>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import avatar from "@/assets/images/avatar.png";
/**
 * 顶部信息栏-用户信息
 */
const logout = () => {
  ElMessageBox.confirm("确认退出吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(() => {
      console.log("退出登录");
      // userLogout().then((res) => {
      //   if (res.code == "0" || res.code == "444444") {
      //     localStorage.clear();
      //     document.cookie = "";
      //     location.reload();
      //   }
      // });
    })
    .catch(() => {});
};
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.header {
  display: flex;
  align-items: center;
  border-bottom: 4px #f2f2f2 solid;
  height: 60px;
  &-title {
    margin: 0 160px 0 16px;
    font-size: 20px;
  }
  &-directory {
    flex: 1;
    span {
      margin-right: 60px;
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
  flex-grow: 1;
  .container {
    overflow: hidden;
    height: 100%;
  }
}
</style>
