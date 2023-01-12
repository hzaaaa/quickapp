import { defineStore, createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const useGlobalStore = defineStore({
  // id: 必须，在所有 Store 中唯一
  id: "GlobalState",
  state: () => ({
    // token
    token: "",
    // 用户名
    username: "",
    // 角色
    role: "",
    // 所属部门
    dept: "",
  }),
  getters: {
    tokenLength: (state) => state.token.length,
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setUsername(username: string) {
      this.username = username;
    },
    setRole(role: string) {
      this.role = role;
    },
    setDept(dept: string) {
      this.dept = dept;
    },
  },
  persist: { key: "GlobalState", storage: window.localStorage },
});

// piniaPersist(持久化)
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;
