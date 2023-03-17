<template>
  <div class="subLayout">
    <div class="subLayout-aside" :class="{ narrow: isCollapse }">
      <el-menu :collapse="isCollapse" :collapse-transition="false" :default-active="route.path">
        <template v-for="menu in authStore.showMenuListGet.find((m) => m.title === '账户')?.childrenList" :key="menu.id">
          <el-sub-menu :index="`${menu.id}`">
            <template #title>
              <el-icon>
                <vIcon :icon="menu.icon" />
              </el-icon>
              <span>{{ menu.title }}</span>
            </template>
            <el-menu-item :index="`${subMenu.redirect}`" v-for="subMenu in menu.childrenList" :key="subMenu.id"
              @click="clickSubMenu">
              <span>{{ subMenu.title }}</span>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
      <el-row class="subLayout-aside-collapse">
        <el-icon v-if="isCollapse" @click="expandSidebar" size="large" class="pointer">
          <Expand />
        </el-icon>
        <el-icon v-else @click="foldSidebar" size="large" class="pointer">
          <Fold />
        </el-icon>
      </el-row>
    </div>
    <div class="subLayout-contain">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Expand, Fold } from "@element-plus/icons-vue";
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
  console.log("clickSubMenu", menuItem);
  router.push(menuItem.index);
};
</script>

<style scoped lang="scss">
.subLayout {
  display: flex;
  width: 100%;
  height: 100%;

  &-aside {
    position: relative;
    flex-grow: 0;
    flex-shrink: 0;
    box-sizing: border-box;
    border-right: 4px #f2f2f2 solid;
    width: 200px;

    &-collapse {
      position: absolute;
      right: 12px;
      bottom: 12px;
    }

    &.narrow {
      width: 64px;
    }
  }

  &-contain {
    overflow: hidden;
    flex: 1;
    padding: 12px 12px 0;
  }

  .pointer {
    cursor: pointer;
  }
}
</style>
