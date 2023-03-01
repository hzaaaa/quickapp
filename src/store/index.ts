import { defineStore, createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const useGlobalStore = defineStore({
  // id: 必须，在所有 Store 中唯一
  id: "GlobalState",
  state: () => ({
    // token
    token: "",
    // 用户ID
    id: <null | number>null,
    // 用户账号
    username: "",
    // 姓名
    nickname: "",
    // 邮箱
    email: "",
    // 角色
    role: "",
    // 角色 code, SuperAdministrator 是初始超管
    roleCodeList: <string[]>[],
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
    setUserId(id: number) {
      this.id = id;
    },
    setUsername(username: string) {
      this.username = username;
    },
    setNickname(nickname: string) {
      this.nickname = nickname;
    },
    setEmail(email: string) {
      this.email = email;
    },
    setRole(role: string) {
      this.role = role;
    },
    setRoleCode(roleCodeList: string[]) {
      this.roleCodeList = roleCodeList;
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
