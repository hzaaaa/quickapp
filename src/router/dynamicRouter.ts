import router from "@/router/index";
import { useAuthStore } from "@/store/auth";
import Layout from "@/layouts/Layout.vue";
import accountLayout from "@/layouts/accountLayout.vue";

// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob("@/views/**/*.vue");

/**
 * 初始化动态路由
 */
export const initDynamicRouter = async () => {
  const authStore = useAuthStore();
  console.log("router", JSON.parse(JSON.stringify(authStore.routerMenuListGet)));

  let dynamicRouter = filterAsyncRouter(JSON.parse(JSON.stringify(authStore.routerMenuListGet)));
  console.log("dynamicRouter", dynamicRouter);
  dynamicRouter.forEach((item: any) => {
    router.addRoute(item);
    console.log("add", item);
  });
  // return dynamicRouter;
};

export const filterAsyncRouter = (menus: Menu.MenuOptions[]) => {
  let res: any = [];
  menus.forEach((menu: Menu.MenuOptions) => {
    let router: any = {};
    router.path = menu.redirect || "";
    if (menu.router) router.name = menu.router;
    if (menu.component) {
      if (menu.component === "Layout") {
        router.component = Layout;
      } else if (menu.component === "accountLayout") {
        router.component = accountLayout;
      } else {
        router.component = modules["/src/views" + menu.component + ".vue"];
      }
    }
    if (menu.childrenList && menu.childrenList.length) {
      router.children = filterAsyncRouter(menu.childrenList);
    }
    res.push(router);
  });
  return res;
};
