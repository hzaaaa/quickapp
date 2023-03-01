<template>
  <div class="mediaHome">
    <el-row class="filter">
      <div class="filter-label">账户名称/ID</div>
      <el-input v-model="searchForm.accountNameOrId" class="filter-input" clearable style="width: 300px"></el-input>
      <div class="filter-label">公司名称</div>
      <el-select
        class="filter-input"
        v-model="searchForm.companyId"
        placeholder="全部"
        clearable
        style="width: 300px"
        @click="getCompanyList"
      >
        <el-option v-for="c in companyList" :key="c.companyId" :label="c.companyName" :value="c.companyId" />
      </el-select>
      <el-button type="primary" @click="search">查询</el-button>
    </el-row>
    <el-button v-if="route.name === 'toutiao'" plain type="primary" v-check="[handleAuthorization, ['media:toutiao:add']]">
      添加账户
    </el-button>
    <el-button v-if="route.name === 'kuaishou'" plain type="primary" v-check="[handleAuthorization, ['media:kuaishou:add']]">
      添加账户
    </el-button>
    <el-config-provider :locale="zhCn">
      <el-table
        :data="tableDataList"
        class="table"
        :header-cell-style="{ backgroundColor: '#f2f2f2', fontSize: '14px' }"
        height="600"
      >
        <el-table-column label="账户ID" prop="remoteAdvertiserId"></el-table-column>
        <el-table-column label="广告投放账户名称" prop="remoteAdvertiserName"></el-table-column>
        <el-table-column label="公司名称" prop="company.companyName"></el-table-column>
        <el-table-column label="授权状态" width="80px">
          <template #default="scope">
            <div v-if="scope.row.authStatus === 1">成功</div>
            <div v-else style="color: #d90000">失败</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template #default>
            <el-button link type="primary" @click="handleAuthorization" size="small">授权</el-button>
          </template>
        </el-table-column>
        <el-table-column width="100px">
          <template #header>
            <div class="materialSyncSwitch">
              <span>同步素材</span>
              <el-tooltip effect="light" :show-arrow="false" content="开启后，每天早上9点后开始同步前1天账户中创建的素材">
                <el-icon size="small"><Warning /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <template #default="scope">
            <el-switch
              v-model="scope.row.materialSyncSwitch"
              :active-value="2"
              :inactive-value="1"
              :before-change="beforeChangeSyncSwitch"
              @click="clickSwitch(scope.row)"
              size="small"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="同步素材储存路径">
          <template #default="scope">
            <div @click="changePath(scope.row)" class="pointer" v-if="scope.row.industry">
              <span>{{ scope.row?.industry?.industryName }}/{{ scope.row?.project?.projectName }}</span>
              <el-icon style="margin-left: 4px"><EditPen /></el-icon>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-config-provider>
    <el-pagination
      layout="prev, pager, next"
      :page-size="pageParams.pageSize"
      :total="pageParams.total"
      @current-change="handlePageChange"
      :hide-on-single-page="true"
    ></el-pagination>
  </div>

  <!-- 存储路径级联表单 -->
  <el-dialog v-model="pathDialogVisible" :title="pathDialogTitle" show-close class="pathDialog mediaPathDialog">
    <div class="pathDialog-remark" v-if="showPathDialogRemark">
      开启时，将在每天早上9点后开始同步前1天账户中创建的素材，请选择素材同步后的储存路径
    </div>
    <div class="pathDialog-title">
      <div class="pathDialog-title-left">行业分类</div>
      <div class="pathDialog-title-right">项目名称</div>
    </div>
    <el-cascader-panel :options="cascaderPathOptions" v-model="cascaderPathArr"></el-cascader-panel>
    <template #footer>
      <el-button @click="cancleChangePath">取消</el-button>
      <el-button type="primary" @click="saveChangePath">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { EditPen, Warning } from "@element-plus/icons-vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import {
  getAdvertiserListAddedApi,
  getCompanyListApi,
  getAuthUrlApi,
  postOpenMaterialSyncApi,
  postCloseAdvertiserApi,
} from "@/api/biz/material";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { getMaterialSidebarListApi } from "@/api/biz/material";

// const router = useRouter();
const route = useRoute();
const appType = computed(() => {
  if (route.path.includes("toutiao")) return 1;
  if (route.path.includes("qianchuan")) return 2;
  if (route.path.includes("kuaishou")) return 3; // 应用类型，巨量引擎（头条）：1 巨量千川（千川）：2 磁力引擎（快手）：3 磁力金牛：4
  return -1;
});
const mediaCategory = computed(() => {
  if (route.path.includes("toutiao")) return 1;
  // if (route.path.includes("qianchuan")) return 2;
  if (route.path.includes("kuaishou")) return 4; // 1-头条; 2-百度; 3-广点通; 4-快手
  return -1;
});
onBeforeRouteLeave(() => {
  // console.log(route.path);
  companyList.value = [];
  searchForm.companyId = "";
});
// 切换侧边栏标签时会触发 watch 生命周期钩子
watch(
  () => route.name,
  (newVal, oldVal) => {
    // console.log(oldVal, "->", newVal, appType.value);
    if (appType.value !== -1) {
      let params = {
        pageNum: 1,
        pageSize: 50,
        appType: appType.value,
        // companyId: 8,
        // accountNameOrId: "",
      };
      getAdvertiserListAddedApi(params).then((res) => {
        tableDataList.value = res.data.list;
        pageParams.total = res.data.total;
      });
    }
  }
);

const searchForm = reactive({
  accountNameOrId: "",
  companyId: "",
});
const companyList = ref<any>([]);
getCompanyListApi({ mediaCategory: mediaCategory.value }).then((res) => {
  companyList.value = res.data.list;
});
const getCompanyList = () => {
  console.log("getCompanyList");
  if (!companyList.value || !companyList.value.length) {
    getCompanyListApi({ mediaCategory: mediaCategory.value }).then((res) => {
      companyList.value = res.data.list;
    });
  }
};
const search = () => {
  console.log("search", route.path);
  let params = <any>{
    pageNum: 1,
    pageSize: 50,
    appType: appType.value,
  };
  if (searchForm.accountNameOrId) params.accountNameOrId = searchForm.accountNameOrId;
  if (searchForm.companyId) params.companyId = searchForm.companyId;
  getAdvertiserListAddedApi(params).then((res) => {
    console.log("getAdvertiserListAddedApi", res);
    tableDataList.value = res.data.list;
    pageParams.total = res.data.total;
  });
};
// const jumpToMediaAdd = () => {
//   // getAuthUrlApi({ appType: appType.value }).then((res) => {
//   //   window.open(res.data.oauthUrl);
//   // });
//   router.push(`${route.path}_add`);
// };

/**
 * 账户首页表格区
 */
const tableDataList = ref<any>([]);
const curAdvertiser = ref(); // 点击同步素材时当前行
let params = {
  pageNum: 1,
  pageSize: 50,
  appType: appType.value,
  // companyId: 8,
  // accountNameOrId: "",
};
getAdvertiserListAddedApi(params).then((res) => {
  console.log("getAdvertiserListAddedApi", params);
  tableDataList.value = res.data.list;
  pageParams.total = res.data.total;
});
// 授权
const handleAuthorization = () => {
  getAuthUrlApi({ appType: appType.value }).then((res) => {
    window.open(res.data.oauthUrl);
  });
};
// 同步素材
const beforeChangeSyncSwitch = () => {
  return false;
};
const clickSwitch = (row: any) => {
  // console.log("clickSwitch", row);
  curAdvertiser.value = row;
  if (row.materialSyncSwitch === 1) {
    // 正在启用
    getMaterialSidebarListApi().then((res) => {
      cascaderPathOptions.value = generateCasOptions(res.data);
    });
    if (curAdvertiser.value.industry && curAdvertiser.value.project) {
      cascaderPathArr.value = [row.industry.industryId, row.project.projectId];
    } else {
      cascaderPathArr.value = [];
    }
    pathDialogTitle.value = "同步素材";
    showPathDialogRemark.value = true;
    pathDialogVisible.value = true;
  } else if (row.materialSyncSwitch === 2) {
    // 正在关闭
    postCloseAdvertiserApi({ advertiserId: curAdvertiser.value.advertiserId }).then((res) => {
      let params = <any>{
        pageNum: 1,
        pageSize: 50,
        appType: appType.value,
      };
      if (searchForm.accountNameOrId) params.accountNameOrId = searchForm.accountNameOrId;
      if (searchForm.companyId) params.companyId = searchForm.companyId;
      getAdvertiserListAddedApi(params).then((res) => {
        tableDataList.value = res.data.list;
        pageParams.total = res.data.total;
      });
    });
  }
};
const changePath = (row: any) => {
  console.log("changePath", curAdvertiser.value, row);
  curAdvertiser.value = row;
  pathDialogTitle.value = "修改储存路径";
  showPathDialogRemark.value = false;
  cascaderPathArr.value = [row.industry.industryId, row.project.projectId];
  pathDialogVisible.value = true;
  getMaterialSidebarListApi().then((res) => {
    cascaderPathOptions.value = generateCasOptions(res.data);
  });
};
// 生成级联数据选项
const generateCasOptions = (originTree: any) => {
  return originTree.map((indus: any) => {
    let simpleIndus = <any>{
      label: indus.indusName,
      value: indus.indusId,
    };
    if (indus.projectList && indus.projectList.length) {
      simpleIndus.children = [];
      indus.projectList.forEach((p: any) => {
        let simpleProject = {
          label: p.projectName,
          value: p.projectId,
        };
        simpleIndus.children.push(simpleProject);
      });
    }
    return simpleIndus;
  });
};

/**
 * 存储路径级联表单
 */
const pathDialogVisible = ref(false);
const pathDialogTitle = ref("");
const showPathDialogRemark = ref(false);
const cascaderPathOptions = ref<any>([]);
const cascaderPathArr = ref<number[]>([]); // 级联表单路径
const saveChangePath = () => {
  if (cascaderPathArr.value && cascaderPathArr.value.length) {
    pathDialogVisible.value = false;
    // console.log("curAdvertiser", curAdvertiser.value.advertiserId);
    // console.log("cascaderPathArr", cascaderPathArr.value[1]);
    let params = {
      advertiserId: curAdvertiser.value.advertiserId,
      projectId: cascaderPathArr.value[1],
    };
    postOpenMaterialSyncApi(params).then((res) => {
      console.log("postOpenMaterialSyncApi", res);
      ElMessage.success("同步素材储存路径选择成功");
      let params = <any>{
        pageNum: 1,
        pageSize: 50,
        appType: appType.value,
      };
      if (searchForm.accountNameOrId) params.accountNameOrId = searchForm.accountNameOrId;
      if (searchForm.companyId) params.companyId = searchForm.companyId;
      getAdvertiserListAddedApi(params).then((re) => {
        console.log("getAdvertiserListAddedApi", re);
        tableDataList.value = re.data.list;
        pageParams.total = re.data.total;
      });
    });
  } else {
    ElMessage.warning("未选择同步素材路径");
  }
};
const cancleChangePath = () => {
  pathDialogVisible.value = false;
  cascaderPathArr.value = [];
};

/**
 * 分页相关
 */
const pageParams = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 20,
});
const handlePageChange = (pageNum: number) => {
  console.log("handlePageChange", pageNum);
  let params = {
    pageNum: pageNum,
    pageSize: pageParams.pageSize,
    appType: appType.value,
    // companyId: 8,
    // accountNameOrId: "",
  };
  getAdvertiserListAddedApi(params).then((res) => {
    tableDataList.value = res.data.list;
    pageParams.total = res.data.total;
  });
};
</script>

<style scoped lang="scss">
// 页面整体布局
.mediaHome {
  font-size: 14px;
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
