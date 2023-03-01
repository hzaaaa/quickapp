<template>
  <div class="userPeek">
    <el-container>
      <el-header>
        <el-icon class="back-icon pointer" @click="back"><ArrowLeft /></el-icon>
        <span>查看已分配媒体账户</span>
      </el-header>
      <el-main>
        <el-row class="filter">
          <div class="filter-label">媒体</div>
          <el-select v-model="choosenMedia" placeholder="请选择" class="filter-input">
            <el-option label="头条" :value="1"></el-option>
            <!-- <el-option label="百度" :value="2"></el-option>
          <el-option label="广点通" :value="3"></el-option> -->
            <el-option label="快手" :value="4"></el-option>
          </el-select>
          <el-button type="primary" @click="search">查询</el-button>
        </el-row>
        <el-table
          :data="TableData"
          class="table"
          :header-cell-style="{ backgroundColor: '#f2f2f2', fontSize: '14px' }"
          height="600"
        >
          <el-table-column label="账户ID" prop="remoteAdvertiserId" width="160"></el-table-column>
          <el-table-column label="广告投放账户名称" prop="remoteAdvertiserName"></el-table-column>
          <el-table-column label="账户主体" prop="companyName"></el-table-column>
          <el-table-column label="媒体平台" prop="mediaCategoryName" width="120"></el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button @click="unbind(scope.row)" size="small">取消分配</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next"
          :page-size="pageParams.pageSize"
          :total="pageParams.total"
          @current-change="handlePageChange"
          :hide-on-single-page="true"
        ></el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from "@element-plus/icons-vue";
import { postGetDistributionMediaAccountListByUserIdApi, postDeleteDistributionMediaAccountListApi } from "@/api/biz/account";
import { reactive, ref } from "vue";
import { Account } from "@/api/interface";
import { useAccountStore } from "@/store/account";
import { useRouter } from "vue-router";

const router = useRouter();
const accountStore = useAccountStore();
const curUserId = accountStore.userInfoGet.userId;
const TableData = ref<Account.MediaAccount[]>();

/**
 * 筛选区
 */
const choosenMedia = ref(1);
const search = () => {
  // console.log("search", choosenMedia.value);
  postGetDistributionMediaAccountListByUserIdApi({
    userId: curUserId,
    mediaCategory: choosenMedia.value,
    pageNum: 1,
    pageSize: 50,
  }).then((res) => {
    TableData.value = res.data.list;
    pageParams.total = res.data.total;
  });
};

postGetDistributionMediaAccountListByUserIdApi({
  userId: curUserId,
  mediaCategory: choosenMedia.value,
  pageNum: 1,
  pageSize: 50,
}).then((res) => {
  TableData.value = res.data.list;
  pageParams.total = res.data.total;
});

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
    mediaCategory: choosenMedia.value,
    pageNum: pageNum,
    pageSize: pageParams.pageSize,
  };
  postGetDistributionMediaAccountListByUserIdApi(params).then((res) => {
    TableData.value = res.data.list;
    pageParams.total = res.data.total;
  });
};

const unbind = (row: any) => {
  ElMessageBox.confirm(`此操作将解绑该媒体账户，是否继续`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // console.log("unbind", row, curUserId);
      let params = {
        userId: curUserId,
        advertiserList: [row.advertiserId],
      };
      postDeleteDistributionMediaAccountListApi(params).then((res) => {
        ElMessage.success("操作成功");
        postGetDistributionMediaAccountListByUserIdApi({
          userId: curUserId,
          mediaCategory: choosenMedia.value,
          pageNum: 1,
          pageSize: 50,
        }).then((re) => {
          TableData.value = re.data.list;
          pageParams.total = re.data.total;
        });
      });
    })
    .catch(() => {});
};

const back = () => {
  router.back();
};
</script>

<style scoped lang="scss">
.userPeek {
  font-size: 14px;
}
// 筛选维度区
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
