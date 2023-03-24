<template>
    <div class="userModify">
        <el-container>
            <el-header>
                <el-icon class="back-icon pointer" @click="back">
                    <ArrowLeft />
                </el-icon>
                <span>快应用【{{ infoFormToday.reportSummary.quickAppInfo.appName }}】运营数据汇总：</span>
            </el-header>
            <el-main>
                <el-tabs @tab-click="resizeEcharts" v-model="activeTab" class="flex-1" style="min-width: 100px">
                    <el-tab-pane label="今日数据" name="今日数据">

                        <div class="date-row">
                            <div class="date-value">日期：{{ todayStr }}</div>
                        </div>
                        <echartsTable v-if="infoFormToday.reportSummary.actualDeepLinks !== null"
                            :timeParams="todayTimeParams" :reportSummary="infoFormToday.reportSummary"
                            :reportList="infoFormToday.reportList" type="today" id="today" ref="ET1">
                        </echartsTable>

                    </el-tab-pane>
                    <el-tab-pane label="昨日数据" name="昨日数据">
                        <div class="date-row">
                            <div class="date-value">日期：{{ yesterdayStr }}</div>
                        </div>
                        <echartsTable v-if="infoFormYesterday.reportSummary.actualDeepLinks !== null"
                            :timeParams="yesterdayTimeParams" :reportSummary="infoFormYesterday.reportSummary"
                            :reportList="infoFormYesterday.reportList" type="yesterday" id="yesterday" ref="ET2">
                        </echartsTable>
                    </el-tab-pane>
                    <el-tab-pane label="最近七日数据" name="最近七日数据">
                        <div class="date-row">
                            <div class="date-value">日期：{{ moment().subtract(6, 'days').format('YYYY-MM-DD') }}
                                <span style="margin:10px">至</span>{{ todayStr }}
                            </div>
                        </div>
                        <echartsTable v-if="infoFormSevenDay.reportSummary.actualDeepLinks !== null"
                            :timeParams="sevenDayTimeParams" :reportSummary="infoFormSevenDay.reportSummary"
                            :reportList="infoFormSevenDay.reportList" type="sevenday" id="sevenday" ref="ET3">
                        </echartsTable>
                    </el-tab-pane>
                    <el-tab-pane label="最近一个月数据" name="最近一个月数据">
                        <div class="date-row">
                            <div class="date-value">日期：{{ moment().subtract(1, 'months').add(1, 'days').format('YYYY-MM-DD')
                            }}
                                <span style="margin:10px">至</span>{{ todayStr }}
                            </div>
                        </div>
                        <echartsTable v-if="infoFormMonth.reportSummary.actualDeepLinks !== null"
                            :timeParams="monthTimeParams" :reportSummary="infoFormMonth.reportSummary"
                            :reportList="infoFormMonth.reportList" type="oneMonth" id="oneMonth" ref="ET4">
                        </echartsTable>
                    </el-tab-pane>
                    <el-tab-pane label="自定义查询范围" name="自定义查询范围">
                        <div class="date-row">

                            <el-date-picker class="date-row-input" v-model="searchForm.twoDate" type="daterange"
                                range-separator="To" start-placeholder="开始时间" end-placeholder="结束时间" />
                            <el-button type="primary" v-throttle="() => queryCutomData()">查询</el-button>
                        </div>
                        <echartsTable v-if="infoFormCustom.reportSummary.actualDeepLinks !== null"
                            :timeParams="customTimeParams" :reportSummary="infoFormCustom.reportSummary"
                            :reportList="infoFormCustom.reportList" type="custom" id="custom" ref="ET5">
                        </echartsTable>
                    </el-tab-pane>
                </el-tabs>

            </el-main>
        </el-container>
    </div>
</template>
  
<script setup lang="ts">
import { useAccountStore } from "@/store/account";
import { ArrowLeft } from "@element-plus/icons-vue";
import { onMounted, reactive, ref, getCurrentInstance, nextTick, provide } from "vue";
import { getRoleListApi } from "@/api/system/role";
import { getDeptTreeApi } from "@/api/system/dept";
import { postCreateUserApi, postUpdateUserApi } from "@/api/system/user";
import { FormInstance, FormRules } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import echartsTable from './echartsTable.vue'
import moment from 'moment';
import {
    getRecordListApi,
    getRecordDetailApi
} from "@/api/biz/launchData";

const router = useRouter();
const route = useRoute();


let activeTab = ref('今日数据');
let ET1 = ref<any>(null);
let ET2 = ref<any>(null);
let ET3 = ref<any>(null);
let ET4 = ref<any>(null);
let ET5 = ref<any>(null);

let resizeEcharts = () => {
    // debugger
    nextTick(() => {
        ET1.value?.resizeCharts();
        ET2.value?.resizeCharts();
        ET3.value?.resizeCharts();
        ET4.value?.resizeCharts();
        ET5.value?.resizeCharts();
    })

}



let queryData = (params: any, infoForm: any, refvalue: any, index: number) => {
    getRecordDetailApi(params).then(res => {
        infoForm.value = res.data;
        if (refvalue) {

            nextTick(() => {
                let n = moment(params.endTime).diff(moment(params.startTime), 'days');
                if (n === 1) {
                    refvalue.value?.startDraw(infoForm.value.reportList, index, 'hour1');
                }
                else if (n > 3) {
                    refvalue.value?.startDraw(infoForm.value.reportList, index, 'day');
                } else {
                    refvalue.value?.startDraw(infoForm.value.reportList, index, 'hour2');
                }
                refvalue.value?.setNumber(infoForm.value.reportSummary);
            })
        }
    })

}

let infoFormModel = {
    reportList: <any[]>[],
    reportSummary: <any>{
        actualDeepLinks: <number | null>null,
        adClick: <number | null>null,
        adClickRatio: <number | null>null,
        adShow: <number | null>null,
        backButtonClick: <number | null>null,
        deepLinkRatio: <number | null>null,
        homePageClick: <number | null>null,
        requestAdNum: <number | null>null,
        requestDeepLinks: <number | null>null,
        showRatio: <number | null>null,
        quickAppInfo: <any>{
            appName: <string>"",
            id: <number | null>null,
            packageName: <string>"",
        }
    },
};

let todayStr = moment().format('YYYY-MM-DD');
let yesterdayStr = moment().subtract(1, 'days').format('YYYY-MM-DD');

// 今天
let infoFormToday = ref(JSON.parse(JSON.stringify(infoFormModel)));
let todayTimeParams = {
    startTime: todayStr,
    endTime: moment().add(1, 'days').format('YYYY-MM-DD'),
}
queryData({
    appId: route.query.appId,
    ...todayTimeParams
}, infoFormToday, ET1, 1)

//昨天
let infoFormYesterday = ref(JSON.parse(JSON.stringify(infoFormModel)));

let yesterdayTimeParams = {
    startTime: yesterdayStr,
    endTime: todayStr,
}
queryData({
    appId: route.query.appId,
    ...yesterdayTimeParams
}, infoFormYesterday, ET2, 2)



//近七天
let infoFormSevenDay = ref(JSON.parse(JSON.stringify(infoFormModel)));
let sevenDayTimeParams = {
    startTime: moment().subtract(6, 'days').format('YYYY-MM-DD'),
    endTime: moment().add(1, 'days').format('YYYY-MM-DD'),
}
queryData({
    appId: route.query.appId,
    ...sevenDayTimeParams,
}, infoFormSevenDay, ET3, 3)

//近一个月
let infoFormMonth = ref(JSON.parse(JSON.stringify(infoFormModel)));
let monthTimeParams = {
    startTime: moment().subtract(1, 'months').add(1, 'days').format('YYYY-MM-DD'),
    endTime: moment().add(1, 'days').format('YYYY-MM-DD'),
}
queryData({
    appId: route.query.appId,
    ...monthTimeParams
}, infoFormMonth, ET4, 4)

//自定义

const searchForm = reactive({

    startTime: <string>'',
    endTime: <string>'',
    twoDate: <any>null,
})
let infoFormCustom = ref(JSON.parse(JSON.stringify(infoFormModel)));
let customTimeParams = ref({
    startTime: <string>'',
    endTime: <string>'',
})

let queryCutomData = () => {
    if (searchForm.twoDate) {

        customTimeParams.value = {
            startTime: moment(searchForm.twoDate[0]).format('YYYY-MM-DD'),
            endTime: moment(searchForm.twoDate[1]).add(1, 'days').format('YYYY-MM-DD'),
        }
        // debugger
        queryData({
            appId: route.query.appId,
            startTime: moment(searchForm.twoDate[0]).format('YYYY-MM-DD'),
            endTime: moment(searchForm.twoDate[1]).add(1, 'days').format('YYYY-MM-DD'),
        }, infoFormCustom, ET5, 5)
    }

}
provide('appId', route.query.appId);










onMounted(() => {

});

const back = () => {
    console.log("back");
    router.back();
};
</script>
  
<style scoped lang="scss">
.userModify {
    font-size: 14px;
    height: 0 !important;
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;

    section {
        height: 0 !important;
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;

        main {
            height: 0 !important;
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;


        }
    }
}

.el-header {
    display: flex;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #f2f2f2;
    height: 48px;
}

.back-icon {
    margin-right: 8px;
}

.tips {
    margin-left: 16px;
    color: var(--el-text-color-placeholder);
}

:deep(.el-tabs__header) {
    margin: 0;
}

.date-row {
    height: 50px;
    font-size: 18px;
    position: relative;

    display: flex;
    align-items: center;
    // width: 50%;

    .date-value {
        height: 100%;
        display: flex;
        align-items: center;
    }

    :deep(.date-row-input) {
        // width: 200px;
        margin-right: 12px;
        flex-grow: 0;
    }
}
</style>
  