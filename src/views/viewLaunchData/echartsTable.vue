<template>
    <div class="echartsTable">

        <div class="row">
            <div class="col1 col">
                <div class="title">实际吊起数</div>
                <div class="number">137890</div>
            </div>
            <div class="col1 col">
                <div class="title">实际吊起数</div>
                <div class="number">137890</div>
            </div>
            <div class="col1 col">
                <div class="title">实际吊起数</div>
                <div class="number">137890</div>
            </div>

            <div class="col2 col nopadding">
                <div class="echartsClass" id="myEcharts1"></div>
            </div>
        </div>
        <div class="row">
            <div class="col1 col"></div>
            <div class="col1 col"></div>
            <div class="col1 col"></div>
            <div class="col2 col"></div>
        </div>


        <div class="row">
            <div class="col1 col"></div>
            <div class="col4 col"></div>
        </div>
        <div class="row">
            <div class="col1 col"></div>
            <div class="col4 col"></div>
        </div>

        <div class="row">
            <div class="col1 col"></div>
            <div class="col1 col"></div>
        </div>


    </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'

import * as echarts from 'echarts';

onMounted(() => {
    nextTick(() => {

        var chartDom = document.getElementById('myEcharts1');

        var myChart = echarts.init(chartDom);
        var option;

        option = {
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

        option && myChart.setOption(option);
    })
})



</script>
<style scoped lang="scss">
.echartsTable {
    * {
        box-sizing: border-box;
    }

    .echartsClass {
        height: 100%;
        width: 100%;
    }

    .row {
        height: 120px;
        display: flex;
        width: 100%;
        border-top: 1px solid black;

        &:last-child {
            border-bottom: 1px solid black;
        }

        .nopadding {
            padding: 0px 0 !important;
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

        .col4 {
            flex: 4;
            width: 0;
            height: 100%;
        }
    }

}
</style>