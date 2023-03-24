<template>
  <div class="mediaHome">




    <el-config-provider :locale="zhCn">
      <el-table :data="tableDataList" class="table" :header-cell-style="{ backgroundColor: '#f2f2f2', fontSize: '14px' }">
        <!-- height="600" -->
        <el-table-column label="序号" width="100" prop="appId"></el-table-column>
        <el-table-column label="快应用名称" prop="appName"></el-table-column>
        <el-table-column label="快应用包名" prop="packageName"></el-table-column>
        <el-table-column label="所在公司主体" prop="companyAbbr"></el-table-column>
        <el-table-column label="今日吊起数/率" align="center">
          <template #default="scope">
            {{ scope.row.todayActualDeepLinks }} / {{ scope.row.todayDeepLinkRatio }}

          </template>
        </el-table-column>
        <el-table-column label="昨日吊起数/率" align="center">
          <template #default="scope">
            {{ scope.row.yesterdayActualDeepLinks }} / {{ scope.row.yesterdayDeepLinkRatio }}

          </template>
        </el-table-column>
        <el-table-column label="今日广告点击率" prop="yesterdayAdClickRatio" align="center"></el-table-column>
        <el-table-column label="昨日广告点击率" prop="todayAdClickRatio" align="center"></el-table-column>

        <!-- <el-table-column label="状态" width="180px">
            <template #default="scope">
              <div v-if="scope.row.authStatus === 1">成功</div>
              <div v-else style="color: #d90000">失败</div>
            </template>
          </el-table-column> -->
        <el-table-column label="操作">
          <template #default="scope">
            <el-button link type="primary" @click="gotoDetail(scope.row)" size="small">查看详情</el-button>

          </template>
        </el-table-column>


      </el-table>
    </el-config-provider>
    <el-pagination layout="prev, pager, next" :current-page="pageParams.pageNum" :page-size="pageParams.pageSize"
      :total="pageParams.total" @current-change="handlePageChange" :hide-on-single-page="true">
    </el-pagination>
  </div>
</template>
  
<script setup lang="ts">
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { ref, reactive, computed, watch } from "vue";
import { EditPen, Warning } from "@element-plus/icons-vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import {
  getRecordListApi,
  getRecordDetailApi
} from "@/api/biz/launchData";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { useCompanyStore } from "@/store/company";

import useListPageHook from '@/hook/listPage'


const route = useRoute();
const router = useRouter();
const CompanyStore = useCompanyStore();


let {
  pageParams,
  tableDataList,
  handlePageChange
} = useListPageHook(getRecordListApi, () => { });


const gotoDetail = (row: any) => {
  router.push(`/viewLaunchDataDetail?appId=${row.appId}`);
}
//跳转新增/编辑页

// const gotoAdd = () => {
//     CompanyStore.setBehavior("add");
//     router.push(`/operationSubjectConfigurationEdit`);
// }
// const gotoEdit = (row: any) => {
//     CompanyStore.setBehavior("modify");
//     getCompanyDetailsApi({
//         companyId: row.companyId
//     }).then(res => {
//         console.log('res', res)
//         CompanyStore.setCompanyInfo(row);
//         router.push(`/operationSubjectConfigurationEdit`);
//     })


// }


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
  