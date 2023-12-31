import { defineStore } from "pinia";

// AppConfigStore AppConfig相关存储
export const useAppConfigStore = defineStore({
    // id: 必须，在所有 Store 中唯一
    id: "AppConfigState",
    state: () => ({
        // 添加或修改AppConfig的行为，add || modify
        behavior: "",
        // 添加、修改AppConfig时的对应AppConfig信息
        modifyAppConfigInfo: {

            configPid: <number | null>null,
            appName: <string>"",
            packageName: <string>"",
            companyId: <number | null>null,
            // companyId: <number | null>null,

            publishedBrand: <string>"",
            publishedBrandList: <any[]>[],
            activatedBrand: <string>"",
            activatedBrandList: <any[]>[],
            operatedBrand: <string>"",
            operatedBrandList: <any[]>[],



            advertiseTimeA: <string>'',
            advertiseTimeB: <string>'',
            advertiseTimeBList: <any[]>[],

            enabled: <number>0,//是否启用. 0-未启用; 1-已启用
            remark: <string>'',

            mediaIdentityList: <any[]>[],
            mediaIdentityIds: <string>'',
            excludeAdvertiseHotCityList: <any[]>[],
            excludeAdvertiseOtherCityList: <any[]>[],
            excludeAdvertiseCityIds: <string>'',

            //禁用媒体标识相关
            mediaIdentities: <any>[],
            mediaIdentityDetailList: <any[]>[],

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
            // debugger
            // AppConfigInfo
            this.modifyAppConfigInfo = AppConfigInfo;

            this.modifyAppConfigInfo.publishedBrandList = this.modifyAppConfigInfo.publishedBrand.split(',');
            if (!this.modifyAppConfigInfo.publishedBrand) {
                this.modifyAppConfigInfo.publishedBrandList = [];
            }
            this.modifyAppConfigInfo.activatedBrandList = this.modifyAppConfigInfo.activatedBrand.split(',');
            if (!this.modifyAppConfigInfo.activatedBrand) {
                this.modifyAppConfigInfo.activatedBrandList = [];
            }
            this.modifyAppConfigInfo.operatedBrandList = this.modifyAppConfigInfo.operatedBrand.split(',');
            if (!this.modifyAppConfigInfo.operatedBrand) {
                this.modifyAppConfigInfo.operatedBrandList = [];
            }
            // debugger

            this.modifyAppConfigInfo.advertiseTimeBList = [];

            if (this.modifyAppConfigInfo.advertiseTimeB) {

                this.modifyAppConfigInfo.advertiseTimeB.split(',').forEach(item => {
                    let a = item.split('-');
                    let o = [
                        a[0] ? (new Date().setTime(Number(a[0]))) : null,
                        a[1] ? (new Date().setTime(Number(a[1]))) : null,
                    ]
                    // debugger
                    this.modifyAppConfigInfo.advertiseTimeBList.push(o);

                });
            }



            //媒体标识
            this.modifyAppConfigInfo.mediaIdentityList = [];
            this.modifyAppConfigInfo.mediaIdentityDetailList = [];




            this.modifyAppConfigInfo.mediaIdentities.forEach((item: any) => {
                if (item.enabled === 1) {
                    this.modifyAppConfigInfo.mediaIdentityList.push(item.identityId);
                    this.modifyAppConfigInfo.mediaIdentityDetailList.push(item);
                }
            })



            // debugger


            this.modifyAppConfigInfo.excludeAdvertiseOtherCityList = this.modifyAppConfigInfo.excludeAdvertiseCityIds.split(',');
            // debugger
            // console.log('query', this.modifyAppConfigInfo.excludeAdvertiseCityIds)



        },

    },
    persist: { key: "AppConfigState", storage: window.localStorage },

});
