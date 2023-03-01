import { defineStore } from "pinia";

// MaterialStore 素材库相关存储
export const useMaterialStore = defineStore({
  // id: 必须，在所有 Store 中唯一
  id: "MaterialStore",
  state: () => ({
    // 素材库当前所在项目信息
    project: {
      projectId: "",
      projectName: "",
    },
    // // 素材库当前所在行业ID
    // indusId: "",
    // // 素材库当前所在行业项目名
    // indusName: "",
    // // 素材库当前所在项目ID
    // projId: "",
    // // 素材库当前所在项目名
    // projName: "",
  }),
  getters: {
    menuItemIndexGet: (state) => `${state.project.projectName}`,
  },
  actions: {
    setProject(project: any) {
      this.project = project;
    },
    // setIndusId(indusId: any) {
    //   this.indusId = indusId;
    // },
    // setIndus(indusName: string) {
    //   this.indusName = indusName;
    // },
    // setProjId(projId: any) {
    //   this.projId = projId;
    // },
    // setProjName(projName: string) {
    //   this.projName = projName;
    // },
  },
  persist: { key: "MaterialStore", storage: window.localStorage },
  // persist: { key: "AccountState", storage: window.localStorage, paths: ["behaviorGet", "userInfoGet"] },
});
