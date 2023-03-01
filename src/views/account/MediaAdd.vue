<template>
  <div class="mediaAdd">
    <el-container>
      <el-header>
        <div class="mediaAdd-title">选择需添加的账户</div>
      </el-header>
      <el-main>
        <el-row class="filter">
          <div class="filter-label">账户名称/ID</div>
          <el-input v-model="searchForm.accountNameOrId" class="filter-input" clearable></el-input>
          <div class="filter-label">公司名称</div>
          <el-select class="filter-input" v-model="searchForm.companyId" placeholder="全部" clearable>
            <el-option v-for="c in companyList" :key="c.companyId" :label="c.companyName" :value="c.companyId" />
          </el-select>
          <el-button type="primary" @click="search">查询</el-button>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-config-provider :locale="zhCn">
              <el-table
                ref="multipleTableRef"
                :data="tableData"
                class="table"
                :header-cell-style="{ backgroundColor: '#f2f2f2', fontSize: '14px' }"
                @select="handleSelect"
                @select-all="handleSelectAll"
                height="500"
              >
                <el-table-column type="selection" width="30"></el-table-column>
                <el-table-column label="账户ID" prop="remoteAdvertiserId" width="150"></el-table-column>
                <el-table-column label="广告投放账户名称" prop="remoteAdvertiserName"></el-table-column>
                <el-table-column label="公司名称" prop="company.companyName"></el-table-column>
              </el-table>
            </el-config-provider>
          </el-col>
          <el-col :span="8">
            <el-config-provider :locale="zhCn">
              <el-table :data="choosenList" class="result" height="500">
                <el-table-column prop="remoteAdvertiserName">
                  <template #header>
                    <div class="result-title">
                      <span>已选({{ choosenList.length }})</span>
                      <el-button link type="primary" @click="clearChoosenAccount">清空</el-button>
                    </div>
                  </template>
                  <template #default="scope">
                    <div class="result-list-row pointer" @click="cancleSelection(scope.row)">
                      <span>{{ scope.row.remoteAdvertiserName }}</span>
                      <el-icon><Close /></el-icon>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-config-provider>

            <!-- <div class="result-title">
              <span>已选({{ choosenList.length }})</span>
              <el-button link type="primary" @click="clearChoosenAccount">清空</el-button>
            </div>
            <div class="result-list">
              <div v-for="item in choosenList" :key="item.accountId" class="result-list-row pointer" @click="cancleSelection(item)">
                <span>{{ item.remoteAdvertiserName }}</span>
                <el-icon><Close /></el-icon>
              </div>
            </div> -->
          </el-col>
        </el-row>
        <el-row>
          <el-button @click="back">取消</el-button>
          <el-button type="primary" @click="saveMediaAdd">确定</el-button>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
// import { ElTable } from "element-plus";
import { computed, nextTick, reactive, ref } from "vue";
import { Close } from "@element-plus/icons-vue";
import { getAdvertiserListUnaddedApi, getCompanyListApi, postAddAdvertiserApi } from "@/api/biz/material";
import { useRoute, useRouter } from "vue-router";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
const route = useRoute();
const router = useRouter();
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
const searchForm = reactive({
  accountNameOrId: "",
  companyId: "",
});
const companyList = ref<any>([]);
getCompanyListApi({ mediaCategory: mediaCategory.value }).then((res) => {
  companyList.value = res.data.list;
});
const search = () => {
  console.log("search", route.path);
  let params = <any>{
    pageNum: 1,
    pageSize: 50,
    appType: appType.value,
  };
  if (searchForm.accountNameOrId) params.accountNameOrId = searchForm.accountNameOrId;
  if (searchForm.companyId) params.companyId = searchForm.companyId;
  getAdvertiserListUnaddedApi(params).then((res) => {
    console.log("getAdvertiserListAddedApi", res);
    tableData.value = res.data;
    nextTick(() => {
      let needChooseList = res.data.filter((media: any) => choosenIdList.value.includes(media.advertiserId));
      needChooseList.forEach((row: any) => {
        multipleTableRef.value?.toggleRowSelection(row, true);
      });
    });
  });
};

/**
 * 账户添加表格区
 */
const tableData = ref<any>([]);
let params = {
  appType: appType.value,
  // companyId: 8,
  // accountNameOrId: "",
};
getAdvertiserListUnaddedApi(params).then((res) => {
  console.log("getAdvertiserListUnaddedApi", res);
  tableData.value = res.data;
  if (!res.data || !res.data.length) {
    // 从外部页面返回到添加账户页面时，如果没有未添加的数据则跳到媒体账户列表页
    ElMessage.warning("已添加全部账户，请勿重复操作");
    router.push(route.path.split("_")[0]);
  }
});
const multipleTableRef = ref<any>();
const handleSelect = (selection: any, row: any) => {
  console.log("handleSelect", selection, row);
  let index = choosenIdList.value.indexOf(row.advertiserId);
  if (index !== -1) {
    choosenList.value.splice(index, 1);
    choosenIdList.value.splice(index, 1);
  } else {
    choosenList.value.push(row);
    choosenIdList.value.push(row.advertiserId);
  }
};
const handleSelectAll = (selection: any) => {
  // console.log("handleSelectAll", selection);
  if (selection.length) {
    // 全选，遍历左侧列表，判断左侧某行在不在右侧，不在则添加
    tableData.value?.forEach((row: any) => {
      let index = choosenIdList.value.indexOf(row.advertiserId);
      if (index === -1) {
        choosenList.value.push(row);
        choosenIdList.value.push(row.advertiserId);
      }
    });
  } else {
    // 全不选，遍历左侧列表，判断左侧某行在不在右侧，在则删除
    tableData.value?.forEach((row: any) => {
      let index = choosenIdList.value.indexOf(row.advertiserId);
      if (index !== -1) {
        choosenList.value.splice(index, 1);
        choosenIdList.value.splice(index, 1);
      }
    });
  }
};
const saveMediaAdd = () => {
  // console.log("saveMediaAdd", choosenIdList.value);
  postAddAdvertiserApi({ advertiserIds: choosenIdList.value }).then((res) => {
    console.log("postAddAdvertiserApi", res);
    ElMessage.success("添加媒体账户成功");
    choosenList.value = [];
    choosenIdList.value = [];
    // let params = <any>{
    //   appType: appType.value,
    // };
    // if (searchForm.companyId) params.companyId = searchForm.companyId;
    // if (searchForm.accountNameOrId) params.accountNameOrId = searchForm.accountNameOrId;
    // searchForm.companyId = "";
    // searchForm.accountNameOrId = "";
    // getAdvertiserListUnaddedApi({ appType: appType.value }).then((res) => {
    //   tableData.value = res.data;
    // });

    // 添加媒体账户成功后返回媒体首页
    router.push(route.path.split("_")[0]);
  });
};

/**
 * 右侧已选账户列表
 */
let choosenList = ref<any[]>([]);
let choosenIdList = ref<number[]>([]);
const clearChoosenAccount = () => {
  ElMessageBox.confirm(`此操作将清空当前已选媒体账户，是否继续`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      multipleTableRef.value?.clearSelection();
      choosenList.value = [];
      choosenIdList.value = [];
    })
    .catch(() => {});
};
const cancleSelection = (row: any) => {
  // console.log("row", row);
  let index = choosenIdList.value.indexOf(row.advertiserId);
  let leftRow = multipleTableRef.value.data.find((media: any) => row.advertiserId === media.advertiserId);
  // console.log("leftRow", leftRow);
  if (index !== -1) {
    choosenList.value.splice(index, 1);
    choosenIdList.value.splice(index, 1);
  }
  if (leftRow) {
    multipleTableRef.value.toggleRowSelection(leftRow);
  }
};

const back = () => {
  router.push(route.path.split("_")[0]);
};
</script>

<style scoped lang="scss">
// 页面整体布局
.mediaAdd {
  font-size: 14px;
}
.filter {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  &-label {
    margin-right: 8px;
  }
  &-input {
    margin-right: 12px;
    width: auto;
  }
}
.table {
  margin-bottom: 12px;
  border-radius: 4px 4px 0 0;
  font-size: 12px;
}
.result {
  font-size: 12px;
  &-title {
    display: flex;
    justify-content: space-between;
    border-radius: 4px 4px 0 0;
    font-size: 14px;
  }
  &-list-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.el-header {
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f2f2f2;
  height: 48px;
  font-size: 16px;
}
// .el-row {
//   // align-items: center;
//   // height: 48px;
// }
</style>
