<template>
    <div class="echartsTable">

        <div class="row">
            <div class="col1 col">
                <div class="title">实际吊起数</div>
                <div class="number">137890</div>
            </div>
            <div class="col1 col">
                <div class="title">请求吊起数</div>
                <div class="number">137890</div>
            </div>
            <div class="col1 col">
                <div class="title">吊起率</div>
                <div class="number">137890</div>
            </div>

            <div class="col2 col echartsCol">
                <div class="echartsClass" :id="`${props.type}myEcharts1`"></div>
                <div class="btn-group">
                    <div class="btn">
                        <el-button @click="createZXT(myChartRow1)">折线图</el-button>
                    </div>
                    <div class="btn">
                        <el-button @click="createZZT(myChartRow1)">柱状图</el-button>
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
                <div class="number">137890</div>
            </div>
            <div class="col1 col">
                <div class="title">请求广告数</div>
                <div class="number">137890</div>
            </div>
            <div class="col1 col">
                <div class="title">呈现率</div>
                <div class="number">137890</div>
            </div>

            <div class="col2 col echartsCol">
                <div class="echartsClass" :id="`${props.type}myEcharts2`"></div>
                <div class="btn-group">
                    <div class="btn">
                        <el-button @click="createZXT(myChartRow2)">折线图</el-button>
                    </div>
                    <div class="btn">
                        <el-button @click="createZZT(myChartRow2)">柱状图</el-button>
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
                <div class="number">137890</div>
            </div>
            <div class="col1 col">
                <div class="title">广告点击率</div>
                <div class="number">137890</div>
            </div>


            <div class="col3 col echartsCol">
                <div class="echartsClass" :id="`${props.type}myEcharts3`"></div>
                <div class="btn-group">
                    <div class="btn">
                        <el-button @click="createZXT(myChartRow3)">折线图</el-button>
                    </div>
                    <div class="btn">
                        <el-button @click="createZZT(myChartRow3)">柱状图</el-button>
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
                <div class="number">137890</div>
            </div>
            <div class="col4 col">
                <div class="title">快应用首页进入次数</div>
                <div class="number">137890</div>
            </div>
        </div>

        <div class="row">
            <div class="col1 col">
                <div class="title">用户提交意见反馈的次数</div>
            </div>
            <div class="col1 col ">
                <el-button-group>
                    <el-button :type="activeTab === 1 ? 'primary' : ''" plain @click="activeTab = 1">全部手机品牌</el-button>
                    <el-button :type="activeTab === 2 ? 'primary' : ''" plain @click="activeTab = 2">VIVO</el-button>
                    <el-button :type="activeTab === 3 ? 'primary' : ''" plain @click="activeTab = 3">OPPO</el-button>
                    <el-button :type="activeTab === 4 ? 'primary' : ''" plain @click="activeTab = 4">华为</el-button>
                    <el-button :type="activeTab === 5 ? 'primary' : ''" plain @click="activeTab = 5">小米</el-button>
                </el-button-group>

                <div class="">{{ activeTab }}</div>

            </div>
        </div>


    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick, onBeforeUnmount, defineProps } from 'vue'
import {
    Download, FullScreen
} from '@element-plus/icons-vue'
import * as echarts from 'echarts';

const props = defineProps(['type'])
let activeTab = ref(1)
let createZXT = (myChart: any) => {
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
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line'
            }
        ]
    };
    // myChart.
    option && myChart.setOption(option, true);
}
let createZZT = (myChart: any) => {
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
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar'
            }
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
    downloadUrlFile(chartImgUrl, 'ECharts 2倍图')
}


let addFullScreenResizeListener = (myDom: any, myChart: any) => {
    chartList.push(myChart);
    // myDom.addEventListener('fullscreenchange', e => {
    //     myChart.resize();
    // })
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
    resizeCharts
})

let intoFullScreen = (myDom: any) => {
    myDom.requestFullscreen();
}
let myChartRow1: any = null;
let myDomRow1: any = null;
let myChartRow2: any = null;
let myDomRow2: any = null;
let myChartRow3: any = null;
let myDomRow3: any = null;
let chartList: any = [];
onMounted(() => {
    document.querySelector
    myDomRow1 = document.getElementById(`${props.type}myEcharts1`);
    myChartRow1 = echarts.init(myDomRow1);
    createZXT(myChartRow1);
    addFullScreenResizeListener(myDomRow1, myChartRow1)

    myDomRow2 = document.getElementById(`${props.type}myEcharts2`);
    myChartRow2 = echarts.init(myDomRow2);
    createZXT(myChartRow2);
    addFullScreenResizeListener(myDomRow2, myChartRow2)

    myDomRow3 = document.getElementById(`${props.type}myEcharts3`);
    myChartRow3 = echarts.init(myDomRow3);
    createZXT(myChartRow3);
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