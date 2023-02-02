<template>
  <div>
    <div>选择需添加的账户</div>
    <div>
      <section>
        <el-row class="mediaHome-search">
          <div class="mediaHome-search-label">账户名称/ID</div>
          <el-input v-model="searchForm.accountName" class="mediaHome-search-input"></el-input>
          <div class="mediaHome-search-label">公司名称</div>
          <el-input v-model="searchForm.companyName" class="mediaHome-search-input"></el-input>
          <el-button @click="search"></el-button>
        </el-row>
        <el-table :data="mockTableDataList">
          <el-table-column label="账户ID" prop="accountId"></el-table-column>
          <el-table-column label="广告投放账户名称" prop="accountName"></el-table-column>
          <el-table-column label="公司名称" prop="companyName"></el-table-column>
        </el-table>
        <el-row>
          <el-button @click="handleCancleMediaAdd"></el-button>
          <el-button type="primary" @click="handleSaveMediaAdd"></el-button>
        </el-row>
      </section>
      <section>
        <div>
          <span>已选</span>
          <span>(2/x)</span>
          <el-button link type="primary" @click="clearChoosenAccount">清空</el-button>
        </div>
        <div>
          <div>思明育才-军队文职1</div>
          <div>思明育才-军队文职2</div>
          <div>思明育才-军队文职3</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
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
]);
const handleCancleMediaAdd = () => {
  console.log("handleCancleMediaAdd");
};
const handleSaveMediaAdd = () => {
  console.log("handleSaveMediaAdd");
};

/**
 * 右侧已选账户列表
 */
const clearChoosenAccount = () => {
  console.log("clearChoosenAccount");
};
</script>

<style scoped lang="scss"></style>
