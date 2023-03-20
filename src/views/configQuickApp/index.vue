<template>
  <div class="mediaHome">

    <!-- v-check="[handleAuthorization, ['media:kuaishou:add']]" -->

    <div class="">
      <el-button plain type="primary" @click='gotoAdd'>
        新增一个快应用的配置
      </el-button>
    </div>
    <el-config-provider :locale="zhCn">
      <el-table :data="tableDataList" class="table" :header-cell-style="{ backgroundColor: '#f2f2f2', fontSize: '14px' }">
        <!-- height="600" -->
        <el-table-column label="序号" width="100" prop="configPid"></el-table-column>
        <el-table-column label="快应用名称" prop="appName"></el-table-column>
        <el-table-column label="快应用包名" prop="packageName"></el-table-column>
        <el-table-column label="所在公司主体" prop="companyName"></el-table-column>
        <el-table-column label="状态" width="180px">
          <template #default="scope">
            <div v-if="scope.row.enabled === true">正在使用</div>
            <div v-else style="color: #d90000">停用</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240px">
          <template #default="scope">
            <el-button link type="primary" @click="gotoEdit(scope.row)" size="small">配置</el-button>
            <el-button link type="primary" @click="removeConfig(scope.row)" size="small"
              style="color: #d90000">删除</el-button>
          </template>
        </el-table-column>


      </el-table>
    </el-config-provider>
    <el-pagination layout="prev, pager, next" :page-size="pageParams.pageSize" :total="pageParams.total"
      @current-change="handlePageChange" :hide-on-single-page="true">
    </el-pagination>
  </div>
</template>
  
<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { EditPen, Warning } from "@element-plus/icons-vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import {
  getConfigListApi,
  deleteConfigApi,
  getConfigDetailsApi,
} from "@/api/biz/appConfig";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { useAppConfigStore } from "@/store/appConfig";


const route = useRoute();
const router = useRouter();
const AppConfigStore = useAppConfigStore();








/**
 * 账户首页表格区
 */
const tableDataList = ref<any>([]);

let params = {
  pageNum: 1,
  pageSize: 50,

  // companyId: 8,
  // accountNameOrId: "",
};
getConfigListApi(params).then((res: any) => {
  console.log("getConfigListApi", params);
  tableDataList.value = res.data.list;
  // debugger
  tableDataList.value = [{ configPid: '1' }]
  tableDataList.value = [...tableDataList.value, ...tableDataList.value];
  tableDataList.value = [...tableDataList.value, ...tableDataList.value];
  tableDataList.value = [...tableDataList.value, ...tableDataList.value];
  tableDataList.value = [...tableDataList.value, ...tableDataList.value];
  tableDataList.value = [...tableDataList.value, ...tableDataList.value];

  //debugger
  pageParams.total = res.data.total;
});
tableDataList.value = [{ configPid: '1' }]
tableDataList.value = [...tableDataList.value, ...tableDataList.value];
tableDataList.value = [...tableDataList.value, ...tableDataList.value];
tableDataList.value = [...tableDataList.value, ...tableDataList.value];
tableDataList.value = [...tableDataList.value, ...tableDataList.value];
tableDataList.value = [...tableDataList.value, ...tableDataList.value];






//跳转新增/编辑页
const gotoAdd = () => {
  AppConfigStore.setBehavior("add");
  router.push(`/configQuickAppEdit`);
}
const gotoEdit = (row: any) => {
  AppConfigStore.setBehavior("modify");
  // getConfigDetailsApi({
  //   configPid: row.configPid
  // }).then(res => {
  //   console.log('res', res)
  //   AppConfigStore.setAppConfigInfo(row);
  //   router.push(`/configQuickAppEdit`);
  // })

  //temp test 
  // debugger
  AppConfigStore.setAppConfigInfo({
    configId: -1,
    configPid: -1,
    appName: "121",
    packageName: "234",
    companyId: 1,
    // companyId: <number | null>null,

    publishedBrand: "VIVO",

    activatedBrand: "OPPO",

    operatedBrand: "小米",




    advertiseTimeA: "000000000000000001111111111111110000000000000000000000000000000001111111111111110000000000000000000000000000000001111111111111110000000000000000000001111111111001111111111111110000000000000000000001111111111001111111111111110000000000000000000001111111111001111111111111110000000000000000000000000000000000000000000000000000000000000000",
    advertiseTimeB: "1680105600000-,-1680019200000,1679414400000-1679932800000",


    enabled: 1,//是否启用. 0-未启用; 1-已启用
    remark: '123',


    mediaIdentityIds: '1',
    excludeAdvertiseCityList: <any[]>[],
    excludeCityIds: '',
  });
  router.push(`/configQuickAppEdit`);

}

const removeConfig = (row: any) => {

  console.log("removeConfig", row);
  ElMessageBox.confirm(`此操作将删除${row.id}的配置，是否继续？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {

      let params = {
        configPid: row.configPid
      };
      // console.log("params", params);
      deleteConfigApi(params).then((res) => {
        console.log("postUpdateUserApi", res);
        if (res.msg === 'success') {
          ElMessage.success('删除配置成功');
        } else {
          ElMessage.error(res.msg);
        }
      });
    })
    .catch(() => {
      console.log('删除取消');
    });
};



/**
 * 分页相关
 */
const pageParams = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 200,
});
const handlePageChange = (pageNum: number) => {
  console.log("handlePageChange", pageNum);
  let params = {
    pageNum: pageNum,
    pageSize: pageParams.pageSize,

    // companyId: 8,
    // accountNameOrId: "",
  };
  getConfigListApi(params).then((res: any) => {
    tableDataList.value = res.data.list;
    pageParams.total = res.data.total;
  });
};
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
  