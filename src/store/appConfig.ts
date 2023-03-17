import { defineStore } from "pinia";

// AppConfigStore 账户相关存储
export const useAppConfigStore = defineStore({
  // id: 必须，在所有 Store 中唯一
  id: "AppConfigState",
  state: () => ({
    // 添加或修改AppConfig的行为，add || modify
    behavior: "",
    // 添加、修改AppConfig时的对应AppConfig信息
    modifyAppConfigInfo: {
        id: <number>-1,
        appName: <string>"",
        packageName: <string>"",
        companyId: <number|null>null,
      
        publishedBrand: <string>"",
        publishedBrandList: <any[]>[],
        activatedBrand: <string>"",
        activatedBrandList: <any[]>[],
        operatedBrand: <string>"",
        operatedBrandList: <any[]>[],
      
        mediaIdentityList: <any[]>[],
        excludeAdvertiseCityList: <any[]>[],
      
        advertiseTimeA: <string>'',
        advertiseTimeB: <string>'',
        advertiseTimeBList: <any[]>[],
      
        enabled: <boolean>false,
        remark: <string>'',
      
      
    },
    
  }),
  getters: {
    behaviorGet: (state) => state.behavior,
    AppConfigInfoGet: (state) => state.modifyAppConfigInfo,
  },
  actions: {
    setBehavior(behavior: string) {
      this.behavior = behavior;
    },
    setAppConfigInfo(AppConfigInfo: any) {
      this.modifyAppConfigInfo = AppConfigInfo;
    },
    
  },
  persist: { key: "AppConfigState", storage: window.localStorage },
  
});
