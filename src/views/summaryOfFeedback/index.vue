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
                <el-option v-for="item in brandListOption" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button type="primary" v-throttle="() => resetPageToOne()">查询</el-button>
        </el-row>
        <el-config-provider :locale="zhCn">
            <el-table :data="tableDataList" class="table"
                :header-cell-style="{ backgroundColor: '#f2f2f2', fontSize: '14px' }">
                <!-- height="600" -->
                <el-table-column label="序号" width="100" prop="remoteAdvertiserId"></el-table-column>
                <el-table-column label="用户识别码（如手机IMEI号）" prop="uid"></el-table-column>
                <el-table-column label="用户所在地区" prop="area"></el-table-column>
                <el-table-column label="用户手机品牌" prop="brand"></el-table-column>
                <el-table-column label="来源快应用" prop="appName"></el-table-column>
                <el-table-column label="用户反馈时间" prop="ts"></el-table-column>
                <el-table-column label="用户反馈内容" prop="complian"></el-table-column>



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
import { ref, reactive, computed, watch } from "vue";
import { EditPen, Warning } from "@element-plus/icons-vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
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
    appId: <string>'',
    brand: <string>'',
    startTime: <string>'',
    endTime: <string>'',
    twoDate: <any>null,
})
const brandListOption = [
    {
        label: '全部',
        value: ''
    },
    {
        label: 'VIVO',
        value: 'VIVO'
    },
    {
        label: 'OPPO',
        value: 'OPPO'
    },
    {
        label: '小米',
        value: '小米'
    },
    {
        label: '华为',
        value: '华为'
    },
]
const beforeQuery = () => {
    if (searchForm.twoDate) {
        searchForm.startTime = moment(searchForm.twoDate[0]).valueOf() + '';
        searchForm.endTime = moment(searchForm.twoDate[1]).valueOf() + '';
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
    