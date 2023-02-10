<template>
  <div class="mediaAdd">
    <div class="mediaAdd-title">选择需添加的账户</div>
    <el-row>
      <el-col :span="16" class="filter">
        <el-row>
          <div class="filter-label">账户名称/ID</div>
          <el-input v-model="searchForm.accountName" class="filter-input"></el-input>
          <div class="filter-label">公司名称</div>
          <el-input v-model="searchForm.companyName" class="filter-input"></el-input>
          <el-button @click="search">查询</el-button>
        </el-row>
        <el-table
          ref="multipleTableRef"
          :data="mockTableDataList"
          class="table"
          :header-cell-style="{ backgroundColor: '#f2f2f2', fontSize: '14px' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column label="账户ID" prop="accountId"></el-table-column>
          <el-table-column label="广告投放账户名称" prop="accountName"></el-table-column>
          <el-table-column label="公司名称" prop="companyName"></el-table-column>
        </el-table>
        <el-row>
          <el-button @click="toggleSelection([mockTableDataList[1], mockTableDataList[3]])">选1，3</el-button>
          <el-button @click="toggleSelection()">全清</el-button>
          <el-button @click="handleCancleMediaAdd">取消</el-button>
          <el-button type="primary" @click="handleSaveMediaAdd">确定</el-button>
        </el-row>
      </el-col>
      <el-col :span="8" class="result">
        <div class="result-title">
          <span>已选</span>
          <span>({{ mockList.length }}/{{ mockTableDataList.length }})</span>
          <el-button link type="primary" @click="clearChoosenAccount">清空</el-button>
        </div>
        <div class="result-list">
          <div v-for="item in mockList" :key="item.accountId" class="result-list-row" @click="toggleSelection([item])">
            <span>{{ item.accountName }}</span>
            <el-icon><Close /></el-icon>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ElTable } from "element-plus";
import { reactive, ref } from "vue";
import { Close } from "@element-plus/icons-vue";

const searchForm = reactive({
  accountName: "",
  companyName: "",
});
const search = () => {
  console.log("search");
};

/**
 * 账户添加表格区
 */
// 模拟数据
const mockTableDataList = reactive([
  {
    accountId: "1749460572914696",
    accountName: "思明育才-军队文职1",
    companyName: "步前程教育科技(北京)有限公司",
  },
  {
    accountId: "1750616153126926",
    accountName: "思明育才-军队文职11",
    companyName: "步前程教育科技(北京)有限公司",
  },
  {
    accountId: "1750616153771080",
    accountName: "思明育才-军队文职12",
    companyName: "步前程教育科技(北京)有限公司",
  },
  {
    accountId: "1750616153771083",
    accountName: "思明育才-军队文职13",
    companyName: "步前程教育科技(北京)有限公司",
  },
  {
    accountId: "1750616153771084",
    accountName: "思明育才-军队文职14",
    companyName: "步前程教育科技(北京)有限公司",
  },
]);
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const handleSelectionChange = (rows: any[]) => {
  console.log("handleSelectionChange", rows);
  mockList.value = rows;
};
const handleCancleMediaAdd = () => {
  console.log("handleCancleMediaAdd");
};
const handleSaveMediaAdd = () => {
  console.log("handleSaveMediaAdd");
};
const toggleSelection = (rows?: any[]) => {
  console.log("rows", rows);
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value?.toggleRowSelection(row, undefined);
    });
  } else {
    multipleTableRef.value?.clearSelection();
  }
};

/**
 * 右侧已选账户列表
 */
let mockList = ref<any[]>([]);
const clearChoosenAccount = () => {
  console.log("clearChoosenAccount");
  multipleTableRef.value?.clearSelection();
};
</script>

<style scoped lang="scss">
// 页面整体布局
.mediaAdd {
  font-size: 14px;
  &-title {
    // margin-bottom: 20px;
    border-bottom: 1px solid #f2f2f2;
    line-height: 60px;
    font-size: 16px;
  }
}
.filter {
  padding-top: 20px;
  border-right: 1px solid #f2f2f2;
  &-label {
    margin-right: 8px;
  }
  &-input {
    margin-right: 12px;
    width: auto;
  }
}
.table {
  margin-top: 8px;
  border-radius: 4px 4px 0 0;
  font-size: 12px;
}
.result {
  padding: 20px 20px 0;
  &-title {
    margin-bottom: 20px;
  }
  &-list {
    line-height: 20px;
    font-size: 12px;
    &-row {
      display: flex;
      align-items: center;
      span {
        margin-right: 8px;
      }
    }
  }
}
// .el-row {
//   // align-items: center;
//   // height: 48px;
// }
</style>
