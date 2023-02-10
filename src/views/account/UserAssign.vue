<template>
  <div class="userAssign">
    <el-container>
      <el-header>
        <el-icon><ArrowLeft /></el-icon>
        <span>分配媒体账户</span>
      </el-header>
      <el-main>
        <el-row class="filter">
          <div class="filter-label">账户名称/ID</div>
          <el-select v-model="searchForm.media" placeholder="请选择">
            <el-option label="头条" :value="1"></el-option>
            <el-option label="快手" :value="0"></el-option>
          </el-select>
          <div class="filter-label">公司名称</div>
          <el-select v-model="searchForm.company" placeholder="请选择">
            <el-option label="公司1" :value="1"></el-option>
            <el-option label="公司2" :value="0"></el-option>
          </el-select>
          <el-button type="primary" @click="search">查询</el-button>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-table
              ref="multipleTableRef"
              :data="TableData"
              class="table"
              :header-cell-style="{ backgroundColor: '#f2f2f2', fontSize: '14px' }"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column label="账户ID" prop="advertiserId"></el-table-column>
              <el-table-column label="广告投放账户名称" prop="remoteAdvertiserName"></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="8" class="result">
            <div class="result-title">
              <span>已选</span>
              <span>({{ mockList.length }}/{{ TableData?.length }})</span>
              <el-button link type="primary" @click="clearChoosenAccount">清空</el-button>
            </div>
            <div class="result-list">
              <div v-for="item in mockList" :key="item.advertiserId" class="result-list-row" @click="toggleSelection([item])">
                <span>{{ item.remoteAdvertiserName }}</span>
                <el-icon><Close /></el-icon>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-button @click="test">取消</el-button>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Close } from "@element-plus/icons-vue";
import { getDistributionMediaAccountListApi } from "@/api/biz/account";
import { onMounted, reactive, ref } from "vue";
import { Account } from "@/api/interface";
import { ElTable } from "element-plus";

const searchForm = reactive({
  media: "",
  company: "",
});
const search = () => {
  console.log("search");
};

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const TableData = ref<Account.MediaAccount[]>();
onMounted(() => {
  getDistributionMediaAccountListApi({ userId: 17 }).then((res) => {
    console.log("getDistributionMediaAccountListApi", res);
    TableData.value = res.data;
  });
});
const test = () => {
  console.log("test");
};
const handleSelectionChange = (rows: any[]) => {
  console.log("handleSelectionChange", rows);
  mockList.value = rows;
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

<style scoped lang="scss"></style>
