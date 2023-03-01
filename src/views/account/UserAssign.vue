<template>
  <div class="userAssign">
    <el-container>
      <el-header>
        <el-icon class="back-icon pointer" @click="back"><ArrowLeft /></el-icon>
        <span>分配媒体账户</span>
      </el-header>
      <el-main>
        <el-row class="filter">
          <div class="filter-label">媒体</div>
          <el-select v-model="searchForm.mediaCategory" placeholder="请选择" class="filter-input" @change="selectChange">
            <el-option v-for="media in optionalMediaList" :key="media.code" :label="media.desc" :value="media.code"></el-option>
          </el-select>
          <div class="filter-label">主体名称</div>
          <el-select v-model="searchForm.companyId" placeholder="请选择" class="filter-input" @click="getCompanyList">
            <el-option
              v-for="com in optionalCompanyList"
              :key="com.companyId"
              :label="com.companyName"
              :value="com.companyId"
            ></el-option>
          </el-select>
          <el-button type="primary" @click="search">查询</el-button>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="14">
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
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column label="账户ID" prop="remoteAdvertiserId" width="160"></el-table-column>
                <el-table-column label="广告投放账户名称" prop="remoteAdvertiserName"></el-table-column>
              </el-table>
            </el-config-provider>
            <el-pagination
              layout="prev, pager, next"
              :page-size="pageParams.pageSize"
              :total="pageParams.total"
              @current-change="handlePageChange"
              :hide-on-single-page="true"
            ></el-pagination>
          </el-col>
          <el-col :span="10">
            <el-table
              :data="choosenList"
              class="result"
              :header-cell-style="{ backgroundColor: '#f2f2f2', fontSize: '14px' }"
              height="500"
            >
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
          </el-col>
        </el-row>
        <el-row>
          <el-button @click="cancelUserAssign">取消</el-button>
          <el-button type="primary" @click="saveUserAssign">确定</el-button>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Close } from "@element-plus/icons-vue";
import {
  getMediaCategoryListApi,
  postDistributionMediaAccountListByFormApi,
  postDistributeMediaAccountListApi,
} from "@/api/biz/account";
import { getCompanyListApi } from "@/api/biz/material";
import { nextTick, reactive, ref } from "vue";
import { Account } from "@/api/interface";
import { useRouter } from "vue-router";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { useAccountStore } from "@/store/account";

const router = useRouter();
const optionalMediaList = ref<any>([]);
const optionalCompanyList = ref<any>([]);
const accountStore = useAccountStore();

const curUserId = accountStore.userInfoGet.userId;
const searchForm = reactive({
  mediaCategory: "1",
  companyId: "",
});
const search = () => {
  console.log("search", searchForm);
  console.log("curUserId", curUserId);
  let params = {
    userId: curUserId,
    mediaCategory: searchForm.mediaCategory,
    companyId: searchForm.companyId,
    pageNum: 1,
    pageSize: 50,
  };
  postDistributionMediaAccountListByFormApi(params).then((res) => {
    tableData.value = res.data.list;
    pageParams.total = res.data.total;
    console.log("choosenList", choosenList.value);
    nextTick(() => {
      let needChooseList = res.data.list.filter((media: any) => choosenIdList.value.includes(media.advertiserId));
      needChooseList.forEach((row: any) => {
        multipleTableRef.value?.toggleRowSelection(row, true);
      });
    });
  });
};

getMediaCategoryListApi().then((res) => {
  console.log("getMediaCategoryListApi", res);
  optionalMediaList.value = res.data;
  // searchForm.mediaCategory = res.data.find((m: any) => m.desc === "头条").code;
  let params = <any>{
    userId: curUserId,
    pageNum: 1,
    pageSize: 50,
  };
  if (searchForm.mediaCategory) params.mediaCategory = searchForm.mediaCategory;
  if (searchForm.companyId) params.companyId = searchForm.companyId;
  postDistributionMediaAccountListByFormApi(params).then((res) => {
    tableData.value = res.data.list;
    pageParams.total = res.data.total;
  });
});
getCompanyListApi({ mediaCategory: searchForm.mediaCategory }).then((res) => {
  console.log("getCompanyListApi", res);
  optionalCompanyList.value = res.data.list;
});
const getCompanyList = () => {
  if (!optionalCompanyList.value || !optionalCompanyList.value.length) {
    getCompanyListApi({ mediaCategory: searchForm.mediaCategory }).then((res) => {
      optionalCompanyList.value = res.data.list;
    });
  }
};
const selectChange = (val: any) => {
  optionalCompanyList.value = [];
  searchForm.companyId = "";
};
const multipleTableRef = ref<any>();
const tableData = ref<Account.MediaAccount[]>();
const cancelUserAssign = () => {
  console.log("cancelUserAssign");
  router.back();
};
const saveUserAssign = () => {
  // console.log("saveUserAssign", curUserId);
  // console.log("saveUserAssign", choosenIdList.value);
  let params = {
    userId: curUserId,
    advertiserList: choosenIdList.value,
  };
  postDistributeMediaAccountListApi(params).then((res) => {
    console.log("postDistributeMediaAccountListApi", res);
    ElMessage.success("分配媒体账户成功");
    choosenList.value = [];
    choosenIdList.value = [];
    // postDistributionMediaAccountListByFormApi({ userId: curUserId, ...searchForm, pageNum: 1, pageSize: 50 }).then((res) => {
    //   tableData.value = res.data.list;
    //   pageParams.total = res.data.total;
    // });
    router.push("/account/user");
  });
};
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
// const handleSelect = (selection: any, row: any) => {
//   console.log("handleSelect", selection, row);
//   let index = choosenIdList.value.indexOf(row.advertiserId);
//   if (index !== -1) {
//     choosenList.value.splice(index, 1);
//     choosenIdList.value.splice(index, 1);
//   } else {
//     // 全不选，遍历左侧列表，判断左侧某行在不在右侧，在则删除
//     tableData.value?.forEach((row: any) => {
//       let index = choosenIdList.value.indexOf(row.advertiserId);
//       if (index !== -1) {
//         choosenList.value.splice(index, 1);
//         choosenIdList.value.splice(index, 1);
//       }
//     });
//   }
// };
// const handleSelectionChange = (rows: any[]) => {
//   console.log("handleSelectionChange", rows);
//   // choosenList.value = rows;
// };

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
    userId: curUserId,
    mediaCategory: searchForm.mediaCategory,
    companyId: searchForm.companyId,
    pageNum: pageNum,
    pageSize: pageParams.pageSize,
  };
  postDistributionMediaAccountListByFormApi(params).then((res) => {
    tableData.value = res.data.list;
    pageParams.total = res.data.total;
    console.log("choosenList", choosenList.value);
    nextTick(() => {
      let needChooseList = res.data.list.filter((media: any) => choosenIdList.value.includes(media.advertiserId));
      needChooseList.forEach((row: any) => {
        multipleTableRef.value?.toggleRowSelection(row, true);
      });
    });
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
  console.log("back");
  router.back();
};
</script>

<style scoped lang="scss">
.userAssign {
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
  font-size: 12px;
}
.result {
  font-size: 12px;
  &-title {
    display: flex;
    justify-content: space-between;
    padding: 0 12px;
    border-radius: 4px 4px 0 0;
    background-color: #f2f2f2;
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
}
.back-icon {
  margin-right: 8px;
}
</style>
