// main.ts
import { createApp } from "vue";
import App from "./App.vue";
// global css
import "@/assets/styles/index.scss";
import router from "@/router/index";
import pinia from "@/store/index";

const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount("#app");
