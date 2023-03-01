import { defineStore } from "pinia";

// AccountStore 账户相关存储
export const useAccountStore = defineStore({
  // id: 必须，在所有 Store 中唯一
  id: "AccountState",
  state: () => ({
    // 添加或修改人员的行为，add || modify
    behavior: "",
    // 添加、修改人员时的对应人员信息
    modifyUserInfo: {
      userId: -1,
      userName: "",
      nickName: "",
      email: "",
      roleList: <any[]>[],
      deptId: -1,
      enabled: -1,
    },
    // 修改角色权限时的角色 id
    modifyRoleId: -1,
    modifyRoleName: "",
  }),
  getters: {
    behaviorGet: (state) => state.behavior,
    userInfoGet: (state) => state.modifyUserInfo,
  },
  actions: {
    setBehavior(behavior: string) {
      this.behavior = behavior;
    },
    setUserInfo(userInfo: any) {
      this.modifyUserInfo = userInfo;
    },
    setRoleId(roleId: number) {
      this.modifyRoleId = roleId;
    },
    setRoleName(roleName: string) {
      this.modifyRoleName = roleName;
    },
  },
  persist: { key: "AccountState", storage: window.localStorage },
  // persist: { key: "AccountState", storage: window.localStorage, paths: ["behaviorGet", "userInfoGet"] },
});
