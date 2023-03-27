import { defineStore } from "pinia";

// IdentityStore Identity相关存储
export const useIdentityStore = defineStore({
    // id: 必须，在所有 Store 中唯一
    id: "IdentityState",
    state: () => ({
        // 添加或修改Identity的行为，add || modify
        behavior: "",
        // 添加、修改Identity时的对应Identity信息
        modifyIdentityInfo: {
            identityId: <number>-1,

            mediaName: <string>"",
            mediaIdentity: <string>"",

            // companyId: <number | null>null,

            adsType: <number>0,//0-Banner;1-弹窗; 2-信息流; 3-开屏; 4-激励
            adsLink: <string>'',
            adsPage: <string>'',
            adsPageShow: <string>'APP首屏',
            adsPageOther: <string>'',
            purchasingQuantity: <number>1000000,
            remark: <string>'',
            enabled: <number>0,//是否启用. 0-未启用; 1-已启用


        },

    }),
    getters: {
        behaviorGet: (state) => state.behavior,
        IdentityInfoGet: (state) => state.modifyIdentityInfo,
    },
    actions: {
        setBehavior(behavior: string) {
            this.behavior = behavior;
        },
        setIdentityInfo(IdentityInfo: any) {
            // debugger
            // IdentityInfo
            this.modifyIdentityInfo = IdentityInfo;




        },

    },
    persist: { key: "IdentityState", storage: window.localStorage },

});
