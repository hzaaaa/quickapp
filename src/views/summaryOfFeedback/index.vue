<template>
    <div class="mediaHome">

        <!-- v-check="[handleAuthorization, ['media:kuaishou:add']]" -->

        <el-row class="filter">
            <div class="filter-label">时间范围</div>
            <div class="" style="margin-right:12px">

                <el-date-picker v-model="searchForm.twoDate" type="datetimerange" range-separator="To"
                    start-placeholder="开始时间" end-placeholder="结束时间" />
            </div>
            <div class="filter-label">选择手机品牌</div>
            <el-select v-model="searchForm.brand" class="filter-input">
                <el-option v-for="item in brandListOption" :label="item.label" :value="item.value"></el-option>

            </el-select>
            <div class="filter-label">选择快应用</div>
            <el-select v-model="searchForm.appId" class="filter-input">
                <el-option v-for="item in appListOption" :label="item.appName" :value="item.id + ''"></el-option>
            </el-select>
            <el-button type="primary" v-throttle="() => resetPageToOne()">查询</el-button>
        </el-row>
        <el-config-provider :locale="zhCn">
            <el-table :data="tableDataList" class="table"
                :header-cell-style="{ backgroundColor: '#f2f2f2', fontSize: '14px' }">
                <!-- height="600" -->
                <el-table-column label="序号" width="100" prop="id" sortable></el-table-column>
                <el-table-column label="用户识别码（如手机IMEI号）" prop="uid" align="center"></el-table-column>
                <el-table-column label="用户所在地区" prop="areaName" align="center"></el-table-column>
                <el-table-column label="用户手机品牌" prop="brand" align="center"></el-table-column>
                <el-table-column label="来源快应用" prop="quickAppInfo.appName" align="center"></el-table-column>
                <el-table-column label="用户反馈时间" align="center" prop="ts" sortable>
                    <template #default="scope">
                        {{ moment(scope.row.ts, "YYYYMMDDHHmmss").format('YYYY-MM-DD HH:mm:ss') }}

                    </template>
                </el-table-column>
                <el-table-column label="用户反馈内容" prop="complain" show-overflow-tooltip></el-table-column>



            </el-table>
        </el-config-provider>
        <el-pagination layout="prev, pager, next" :page-size="pageParams.pageSize" :total="pageParams.total"
            @current-change="handlePageChange" :hide-on-single-page="true">
        </el-pagination>
    </div>
</template>
    
<script setup lang="ts">
import moment from 'moment';
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { ref, reactive, computed, watch, onMounted } from "vue";
import { EditPen, Warning } from "@element-plus/icons-vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import {
    getSearchListApi
} from "@/api/biz/appConfig";
import {
    getFeedbackListApi,
} from "@/api/biz/feedback";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { before } from 'lodash';
import useListPageHook from '@/hook/listPage'


const route = useRoute();
const router = useRouter();


/* 查询区 */
const searchForm = reactive({
    appId: <any>'',
    brand: <any>'',
    startTime: <string>'',
    endTime: <string>'',
    twoDate: <any>null,
})
let appListOption = <any>ref([]);
getSearchListApi({}).then(res => {
    // debugger
    appListOption.value = [{
        appName: '全部',
        id: '',
    }, ...res.data]
})
const brandListOption = [
    {
        label: '全部',
        value: ''
    },
    {
        label: 'VIVO',
        value: 'vivo'
    },
    {
        label: 'OPPO',
        value: 'oppo'
    },
    {
        label: '小米',
        value: 'xiaomi'
    },
    {
        label: '华为',
        value: 'huawei'
    },
]
let brandObj = {
    'total': '',
    'vivo': 'VIVO',
    'oppo': 'OPPO',
    'huawei': '华为',
    'xiaomi': '小米',
}
let { appId, startTime, endTime, brand } = route.query;

if (appId) {
    searchForm.appId = route.query.appId;
    searchForm.brand = brandObj[brand + ''];
    searchForm.twoDate = [moment(startTime + ''), moment(endTime + '')];
}

const beforeQuery = () => {
    if (searchForm.twoDate) {
        searchForm.startTime = moment(searchForm.twoDate[0]).format('YYYY-MM-DD HH:mm:ss');
        searchForm.endTime = moment(searchForm.twoDate[1]).format('YYYY-MM-DD HH:mm:ss');
    } else {
        searchForm.startTime = '';
        searchForm.endTime = '';
    }
    return {
        ...searchForm,
        twoDate: null,
    }
}
let {
    pageParams,
    tableDataList,
    handlePageChange,
    resetPageToOne,
} = useListPageHook(getFeedbackListApi, beforeQuery);

// debugger

</script>
    
<style scoped lang="scss">
// 页面整体布局
.mediaHome {
    font-size: 14px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

// 搜索区
.filter {
    &-label {
        margin-right: 8px;
    }

    &-input {
        margin-right: 12px;
        width: auto;
        width: 180px;
    }
}

// 表格区
.table {
    margin-top: 8px;
    border-radius: 4px 4px 0 0;
    font-size: 12px;
    height: 0;
    flex: 1;

    .materialSyncSwitch {
        display: flex;
        align-items: center;

        span {
            margin-right: 4px;
        }
    }
}

// 存储路径级联表单
.pathDialog {
    &-remark {
        margin-bottom: 8px;
    }

    &-title {
        display: flex;
        border: 1px solid var(--el-border-color);
        border-bottom: none;
        border-radius: 4px 4px 0 0;
        height: 36px;
        background-color: #f2f2f2;
        line-height: 36px;
        font-size: 16px;

        &-left {
            box-sizing: border-box;
            padding-left: 28px;
            border-right: 1px solid var(--el-border-color);
            width: 180px;
        }

        &-right {
            padding-left: 28px;
        }
    }
}

.el-row {
    align-items: center;
    height: 48px;
    // & :deep(.el-input__wrapper) {
    //   flex-grow: 0;
    // }
}
</style>
<style lang="scss">
.mediaPathDialog {
    .el-dialog__body {
        padding-top: 0;
    }
}
</style>
    