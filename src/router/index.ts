import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Layout from "@/layouts/Layout.vue";
// import accountLayout from "@/layouts/accountLayout.vue";
// import { initDynamicRouter } from "./dynamicRouter";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    redirect: "/",
  },
  {
    path: "/",
    name: "Login",
    component: () => import("@/views/Login.vue"), // 注意这里要带上 文件后缀.vue
  },
  {
    path: "/404",
    component: () => import("@/views/info/Info.vue"),
  },
  {
    path: "/info",
    component: Layout,
    children: [
      {
        path: "",
        name: "Info",
        component: () => import("@/views/info/Info.vue"),
      },
    ], // 注意这里要带上 文件后缀.vue
  },
  // {
  //   path: "/library",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "",
  //       // name: "library",
  //       component: () => import("@/views/library/LibraryHome.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "/report",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "",
  //       // name: "report",
  //       component: () => import("@/views/report/ReportHome.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "/account",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "",
  //       component: accountLayout,
  //       children: [
  //         {
  //           path: "/account/toutiao",
  //           component: () => import("@/views/account/ToutiaoHome.vue"),
  //         },
  //       ],
  //     },
  //     {
  //       path: "",
  //       component: accountLayout,
  //       children: [
  //         {
  //           path: "/account/user",
  //           component: () => import("@/views/account/UserHome.vue"),
  //         },
  //         {
  //           path: "/account/role",
  //           component: () => import("@/views/account/RoleHome.vue"),
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    path: "/:catchAll(.*)",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const blackList = ["/account"];
router.beforeEach(async (to, from, next) => {
  // console.log("from", from);

  // console.log("to", to);

  // await initDynamicRouter();
  // console.log("R", router);
  // next({ ...to, replace: true });

  if (blackList.includes(to.path)) {
    next("/404");
    return;
  }
  next();
});

export default router;
