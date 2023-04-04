// main.ts
import { createApp, createVNode } from "vue";
import '@bytedance-ad/mui-vue3/dist/style.css'
import App from "./App.vue";
// global css
import "@/assets/styles/index.scss";
import router from "@/router/index";
import pinia from "@/store/index";
import directives from "@/directives/index";
import { VideoCamera, Avatar } from "@element-plus/icons-vue";
import { useAuthStore } from "@/store/auth";

const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(directives);


app.config.globalProperties.$everyPermissionIsTrue = (value: Array<string>) => {
  const authStore = useAuthStore();
  const authButtonList = authStore.authButtonListGet;
  if (value && value instanceof Array && value.length) {
    const hasPermission = value.every((p) => {
      return authButtonList.includes(p);
    });
    return hasPermission;
  } else {
    throw new Error(`使用方式：v-permission="['library:project']"`);
  }
}

app.mount("#app");

// 创建 vIcon 组件，为了动态使用 element-plus 的 icon
const Icons = { VideoCamera, Avatar };
const vIcon = (props: { icon: string }) => {
  const { icon } = props;
  return createVNode(Icons[icon as keyof typeof Icons]);
};
// 注册 vIcon 组件
app.component("vIcon", vIcon);
