<template>
    <div class="echartsTable">

        <div class="row">
            <div class="col1 col">
                <div class="title">实际吊起数</div>
                <div class="number">{{ reportSummaryC.actualDeepLinks }}</div>
            </div>
            <div class="col1 col">
                <div class="title">请求吊起数</div>
                <div class="number">{{ reportSummaryC.requestDeepLinks }}</div>
            </div>
            <div class="col1 col">
                <div class="title">吊起率</div>
                <div class="number">{{ reportSummaryC.deepLinkRatio }}%</div>
            </div>

            <div class="col2 col echartsCol">
                <div class="echartsClass" :id="`${props.type}myEcharts1`" ref="myEcharts1Ref"></div>
                <div class="btn-group">
                    <div class="btn">
                        <el-button @click="createZXT(myChartRow1, time, deepDataList, deepDataName)">折线图</el-button>
                    </div>
                    <div class="btn">
                        <el-button @click="createZZT(myChartRow1, time, deepDataList, deepDataName, 1)">柱状图</el-button>
                    </div>
                    <div class="btn-icon">
                        <el-icon color="#409EFC" @click="downloadChart(myChartRow1)">
                            <Download />
                        </el-icon>
                        <el-icon color="#409EFC" @click="intoFullScreen(myDomRow1)">
                            <FullScreen />
                        </el-icon>
                    </div>

                </div>
            </div>
        </div>
        <div class="row">
            <div class="col1 col">
                <div class="title">广告呈现数</div>
                <div class="number">{{ reportSummaryC.adShow }}</div>
            </div>
            <div class="col1 col">
                <div class="title">请求广告数</div>
                <div class="number">{{ reportSummaryC.requestAdNum }}</div>
            </div>
            <div class="col1 col">
                <div class="title">呈现率</div>
                <div class="number">{{ reportSummaryC.showRatio }}%</div>
            </div>

            <div class="col2 col echartsCol">
                <div class="echartsClass" :id="`${props.type}myEcharts2`" ref="myEcharts2Ref"></div>
                <div class="btn-group">
                    <div class="btn">
                        <el-button @click="createZXT(myChartRow3, time, clickDataList, clickDataName)">折线图</el-button>
                    </div>
                    <div class="btn">
                        <el-button @click="createZZT(myChartRow2, time, adDataList, adDataName, 2)">柱状图</el-button>
                    </div>
                    <div class="btn-icon">
                        <el-icon color="#409EFC" @click="downloadChart(myChartRow2)">
                            <Download />
                        </el-icon>
                        <el-icon color="#409EFC" @click="intoFullScreen(myDomRow2)">
                            <FullScreen />
                        </el-icon>
                    </div>

                </div>
            </div>
        </div>
        <div class="row">
            <div class="col1 col">
                <div class="title">广告点击数</div>
                <div class="number">{{ reportSummaryC.adClick }}</div>
            </div>
            <div class="col1 col">
                <div class="title">广告点击率</div>
                <div class="number">{{ reportSummaryC.adClickRatio }}%</div>
            </div>


            <div class="col3 col echartsCol">
                <div class="echartsClass" :id="`${props.type}myEcharts3`" ref="myEcharts3Ref"></div>
                <div class="btn-group">
                    <div class="btn">
                        <el-button @click="createZXT(myChartRow3, time, clickDataList, clickDataName)">折线图</el-button>
                    </div>
                    <div class="btn">
                        <el-button @click="createZZT(myChartRow3, time, clickDataList, clickDataName, 3)">柱状图</el-button>
                    </div>
                    <div class="btn-icon">
                        <el-icon color="#409EFC" @click="downloadChart(myChartRow3)">
                            <Download />
                        </el-icon>
                        <el-icon color="#409EFC" @click="intoFullScreen(myDomRow3)">
                            <FullScreen />
                        </el-icon>
                    </div>

                </div>
            </div>
        </div>





        <div class="row">
            <div class="col1 col">
                <div class="title">返回/退出按钮点击数</div>
                <div class="number">{{ reportSummaryC.backButtonClick }}</div>
            </div>
            <div class="col4 col">
                <div class="title">快应用首页进入次数</div>
                <div class="number">{{ reportSummaryC.homePageClick }}</div>
            </div>
        </div>

        <div class="row">
            <div class="col1 col">
                <div class="title">用户提交意见反馈的次数</div>
            </div>
            <div class="col1 col ">
                <el-button-group>
                    <el-button :type="activeTab === 'total' ? 'primary' : ''" plain
                        @click="activeTab = 'total'">全部手机品牌</el-button>
                    <el-button :type="activeTab === 'vivo' ? 'primary' : ''" plain
                        @click="activeTab = 'vivo'">VIVO</el-button>
                    <el-button :type="activeTab === 'oppo' ? 'primary' : ''" plain
                        @click="activeTab = 'oppo'">OPPO</el-button>
                    <el-button :type="activeTab === 'huawei' ? 'primary' : ''" plain
                        @click="activeTab = 'huawei'">华为</el-button>
                    <el-button :type="activeTab === 'xiaomi' ? 'primary' : ''" plain
                        @click="activeTab = 'xiaomi'">小米</el-button>
                </el-button-group>

                <div class="" style="cursor: pointer;" @click="gotoFeedback">{{ feedbackData[activeTab] }}</div>

            </div>
        </div>


    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount, defineProps, watch, inject } from 'vue'
import {
    Download, FullScreen
} from '@element-plus/icons-vue'
import * as echarts from 'echarts';
import {
    getFeedbackCountApi,
} from "@/api/biz/feedback";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import qs from "qs";
import moment from 'moment';

let props = defineProps(['type', 'reportSummary', 'timeParams'])
let {
    reportSummary,
    type,
    timeParams,
} = props;

const router = useRouter();
const appId = inject('appId')

//数字相关
let reportSummaryC = ref(reportSummary)
let setNumber = (reportSummaryF: any) => {
    reportSummaryC.value = reportSummaryF;
}



//反馈次数
let gotoTimeParams = timeParams;
let feedbackData = ref({
    'huawei': <number>0,
    'oppo': <number>0,
    'total': <number>0,
    'vivo': <number>0,
    'xiaomi': <number>0,
})
let queryFeedbackCount = (params: any) => {
    getFeedbackCountApi(params).then(res => {

        feedbackData.value = res.data;
    })
}
if (type !== 'custom') {
    queryFeedbackCount({
        ...timeParams,
        appId: appId
    })
} else {
    watch(() => props.timeParams, (nv, ov) => {
        // debugger
        gotoTimeParams = nv;
        queryFeedbackCount({
            ...nv,
            appId: appId
        })
    }, {
        deep: true,
        immediate: true,
    })
}

let activeTab = ref(<string>'total');
//跳转相关
let gotoFeedback = () => {
    let params = {
        appId, ...gotoTimeParams, brand: activeTab.value
    }
    router.push(`/summaryOfFeedback?${qs.stringify(params)}`)
}


//图表相关
let time = <any>[];
let deepDataList = <any>[[], [], []];
let deepDataName = <any>['实际吊起数', '请求吊起数', '吊起率'];
let adDataList = <any>[[], [], []];
let adDataName = <any>['广告呈现数', '请求广告数', '呈现率'];
let clickDataList = <any>[[], [], []];
let clickDataName = <any>['广告点击数', '广告点击率'];

let startDraw = (reportList: any, index: number, granularity: string) => {
    // debugger
    reportList.sort((a: any, b: any) => {
        if (a.statementDate < b.statementDate) {
            return -1
        } else {
            return 1
        }
    })
    time = [];
    deepDataList = [[], [], []];
    adDataList = [[], [], []];
    clickDataList = [[], [], []];

    reportList.forEach((item: any) => {

        if (granularity === 'hour1') {
            time.push(moment(item.statementDate).format('HH') + '时');
        } else if (granularity === 'hour2') {
            time.push(moment(item.statementDate).format('DD') + '日' + moment(item.statementDate).format('HH') + '时');
        } else if (granularity === 'day') {
            time.push(moment(item.statementDate).format('MM-DD'));
        }
        deepDataList[0].push(item.actualDeepLinks)
        deepDataList[1].push(item.requestDeepLinks)


        adDataList[0].push(item.adShow)
        adDataList[1].push(item.requestAdNum)


        clickDataList[0].push(item.adClick)

    })

    createZXT(myChartRow1, time, deepDataList, deepDataName);
    createZXT(myChartRow2, time, adDataList, adDataName);
    createZXT(myChartRow3, time, clickDataList, clickDataName);
}

let createZXT = (myChart: any, time: any, dataList: any, dataName: any) => {

    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            },
        },
        axisPointer: {

        },
        grid: {
            top: '15%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: time
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: dataName[0],
                data: dataList[0],
                // data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line',
                showSymbol: false,
            },
            {
                name: dataName[1],
                data: dataList[1],
                // data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line',
                showSymbol: false,
            },

        ]
    };
    // myChart.

    option && myChart.setOption(option, true);
}

let createZZT = (myChart: any, time: any, dataList: any, dataName: any, index: number) => {
    // debugger
    var option = {
        tooltip: {
            show: true
        },
        grid: {
            top: '15%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: time
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [

            {
                name: dataName[0],
                data: dataList[0],
                // data: [150, 230, 224, 218, 135, 147, 260],
                type: 'bar'
            },
            index === 3 ? {} : {
                name: dataName[1],
                data: dataList[1],
                // data: [150, 230, 224, 218, 135, 147, 260],
                type: 'bar'
            },
        ]
    };
    // myChart.
    option && myChart.setOption(option, true);
}

let downloadUrlFile = (url: any, fileName: any) => {
    const a: any = document.createElement('a')
    document.body.appendChild(a)
    a.style = 'display: none'
    a.href = url
    if (fileName) {
        a.download = fileName
    }
    a.click()
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
let downloadChart = (myChart: any) => {
    // 获取base64图片
    const chartImgUrl = myChart.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff'
    })
    // console.log(chartImgUrl)
    // 下载base64图片
    downloadUrlFile(chartImgUrl, 'ECharts图表')
}


let addFullScreenResizeListener = (myDom: any, myChart: any) => {
    chartList.push(myChart);

    window.addEventListener("resize", e => {
        myChart.resize();
    })
}
let resizeCharts = () => {
    nextTick(() => {
        //     debugger
        chartList.forEach((item: any) => {
            item && item.resize();
        })
    })

}
defineExpose({
    resizeCharts, startDraw, setNumber
})

let intoFullScreen = (myDom: any) => {
    myDom.requestFullscreen();
}
let myEcharts1Ref = ref(null);
let myEcharts2Ref = ref(null);
let myEcharts3Ref = ref(null);
let myChartRow1: any = null;
let myDomRow1: any = null;
let myChartRow2: any = null;
let myDomRow2: any = null;
let myChartRow3: any = null;
let myDomRow3: any = null;
let chartList: any = [];
onMounted(() => {
    myEcharts1Ref
    // debugger
    // document.querySelector
    // myDomRow1 = document.getElementById(`${props.type}myEcharts1`);
    myDomRow1 = myEcharts1Ref.value;

    myChartRow1 = echarts.init(myDomRow1);

    addFullScreenResizeListener(myDomRow1, myChartRow1)

    // myDomRow2 = document.getElementById(`${props.type}myEcharts2`);
    myDomRow2 = myEcharts2Ref.value;
    myChartRow2 = echarts.init(myDomRow2);

    addFullScreenResizeListener(myDomRow2, myChartRow2)

    // myDomRow3 = document.getElementById(`${props.type}myEcharts3`);
    myDomRow3 = myEcharts3Ref.value;
    myChartRow3 = echarts.init(myDomRow3);

    addFullScreenResizeListener(myDomRow3, myChartRow3)

})
onBeforeUnmount(() => {
    console.log('chartList', chartList)
    chartList.forEach((item: any) => {
        item && item.dispose();
    })

})



</script>
<style scoped lang="scss">
.echartsTable {
    :deep(.el-tabs__content) {
        text-align: center;
        font-size: 20px;

    }

    * {
        box-sizing: border-box;
    }

    .echartsClass {
        height: 100%;
        width: 75%;
        // background: red;

        &:fullscreen {
            background: white;
        }
    }


    .btn-group {
        width: 0;
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;

        box-sizing: border-box;
        padding-top: 10px;

        .btn {
            height: 0;
            flex: 1;
            display: flex;
            align-items: center;
        }

        .btn-icon {
            width: 100%;
            height: 0;
            flex: 1;

            display: flex;
            justify-content: space-around;
            align-items: center;
        }
    }

    .row {
        height: 120px;
        display: flex;
        width: 100%;
        border-top: 1px solid black;

        &:last-child {
            border-bottom: 1px solid black;
        }

        .echartsCol {
            padding: 0px 0 !important;
            flex-direction: row !important;
            justify-content: flex-start !important;
        }

        .col {
            border-left: 1px solid black;
            // background: olivedrab;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            padding: 14px 0;
            font-size: 20px;


        }

        .col:first-child {
            border-left: 0
        }

        .col1 {
            flex: 1;
            width: 0;
            height: 100%;

        }

        .col2 {
            flex: 2;
            width: 0;
            height: 100%;
        }

        .col3 {
            flex: 3;
            width: 0;
            height: 100%;
        }

        .col4 {
            flex: 4;
            width: 0;
            height: 100%;
        }
    }

}
</style>