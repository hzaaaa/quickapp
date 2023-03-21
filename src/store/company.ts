import { defineStore } from "pinia";

// CompanyStore Company相关存储
export const useCompanyStore = defineStore({
    // id: 必须，在所有 Store 中唯一
    id: "CompanyState",
    state: () => ({
        // 添加或修改Company的行为，add || modify
        behavior: "",
        // 添加、修改Company时的对应Company信息
        modifyCompanyInfo: {
            companyId: <number>-1,

            companyName: <string>"",
            companyAbbr: <string>"",
            companyIdentity: <string>"",

            enabled: <number>0,//是否启用. 0-未启用; 1-已启用
            remark: <string>'',
        },

    }),
    getters: {
        behaviorGet: (state) => state.behavior,
        CompanyInfoGet: (state) => state.modifyCompanyInfo,
    },
    actions: {
        setBehavior(behavior: string) {
            this.behavior = behavior;
        },
        setCompanyInfo(CompanyInfo: any) {
            // debugger
            // CompanyInfo
            this.modifyCompanyInfo = CompanyInfo;




        },

    },
    persist: { key: "CompanyState", storage: window.localStorage },

});
