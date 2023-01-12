import { defineStore } from "pinia";
import { getShowMenuList, getRouterMenuList } from "@/utils/util";
import { getAuthButtonListApi } from "@/api/login/login";

// AuthStore 菜单、权限相关存储
export const useAuthStore = defineStore({
  id: "AuthState",
  state: () => ({
    // 菜单列表 作为动态路由
    authMenuList: <Menu.MenuOptions[]>[],
    // 按钮权限列表
    authButtonList: <string[]>[],
  }),
  getters: {
    // 按钮权限列表
    authButtonListGet: (state) => state.authButtonList,
    // 后端返回的菜单列表
    authMenuListGet: (state) => state.authMenuList,
    // 后端返回的菜单列表 => 左侧菜单栏渲染，去除 hidden == 1 和 type > 5
    showMenuListGet: (state) => getShowMenuList(state.authMenuList),
    // 后端返回的菜单列表 => 生成动态路由，去除 type > 5
    routerMenuListGet: (state) => getRouterMenuList(state.authMenuList),
  },
  actions: {
    // 获取按钮权限列表
    async getAuthButtonList() {
      // console.log("store,auth.ts 里获取按钮的 actions");
      const { data } = await getAuthButtonListApi();
      this.authButtonList = data;
    },
    // 设置菜单列表
    async setAuthMenuList(menuList: Menu.MenuOptions[]) {
      this.authMenuList = menuList;
    },
  },
  persist: { key: "AuthState", storage: window.localStorage },
});
