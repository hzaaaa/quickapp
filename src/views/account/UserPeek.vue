<template>
  <div class="userPeek">
    <el-container>
      <el-header>
        <el-icon><ArrowLeft /></el-icon>
        <span>查看已分配媒体账户</span>
      </el-header>
      <el-main>
        <el-table :data="TableData" class="table" :header-cell-style="{ backgroundColor: '#f2f2f2', fontSize: '14px' }">
          <el-table-column label="账户ID" prop="advertiserId"></el-table-column>
          <el-table-column label="广告投放账户名称" prop="remoteAdvertiserName"></el-table-column>
          <el-table-column label="账户主体" prop="companyName"></el-table-column>
          <el-table-column label="媒体平台" prop="mediaCategoryName"></el-table-column>
        </el-table>
        <el-row>
          <el-button @click="test">取消</el-button>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from "@element-plus/icons-vue";
import { getDistributionMediaAccountListApi } from "@/api/biz/account";
import { onMounted, ref } from "vue";
import { Account } from "@/api/interface";

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
</script>

<style scoped lang="scss"></style>
