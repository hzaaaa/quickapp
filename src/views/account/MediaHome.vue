<template>
  <div class="mediaHome">
    <el-row class="mediaHome-search">
      <div class="mediaHome-search-label">账户名称/ID</div>
      <el-input v-model="searchForm.accountName" class="mediaHome-search-input"></el-input>
      <div class="mediaHome-search-label">公司名称</div>
      <el-input v-model="searchForm.companyName" class="mediaHome-search-input"></el-input>
      <el-button @click="search"></el-button>
    </el-row>
    <el-button plain type="primary" @click="jumpToMediaAdd">添加账户</el-button>
    <el-table :data="mockTableDataList">
      <el-table-column label="账户ID" prop="accountId"></el-table-column>
      <el-table-column label="广告投放账户名称" prop="accountName"></el-table-column>
      <el-table-column label="公司名称" prop="companyName"></el-table-column>
      <el-table-column label="授权状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button link type="primary" @click="handleAuthorization(scope.row)">操作</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="synchronizedSwitch">
        <template #header>
          <span>同步素材</span>
          <el-tooltip content="开启后，每天早上9点后开始同步前1天账户中创建的素材" :show-arrow="false">
            <el-icon size="small"><Warning /></el-icon>
          </el-tooltip>
        </template>
        <template #default="scope">
          <el-switch
            v-model="scope.row.synchronizedSwitch"
            :active-value="1"
            :inactive-value="0"
            @change="changeSynchronizedSwitch"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="同步素材储存路径" prop="synchronizedPath">
        <template #default="scope">
          <div @click="openPathDialog">
            <span>{{ scope.row.synchronizedPath }}</span>
            <el-icon style="margin-left: 4px"><EditPen /></el-icon>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 存储路径级联表单 -->
  <el-dialog v-model="pathDialogVisible" :show-close="false" class="pathDialog">
    <div class="pathDialog-title">
      <div class="pathDialog-title-left">行业分类</div>
      <div class="pathDialog-title-right">项目名称</div>
    </div>
    <el-cascader-panel :options="pathOptions" @change="handlePathChange" v-model="tempPathArr"></el-cascader-panel>
    <template #footer>
      <el-button @click="cancleChangePath">取消</el-button>
      <el-button type="primary" @click="saveChangePath">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { EditPen, Warning } from "@element-plus/icons-vue";
const searchForm = reactive({
  accountName: "",
  companyName: "",
});
const search = () => {
  console.log("search");
};
const jumpToMediaAdd = () => {
  console.log("jumpToMediaAdd");
};

/**
 * 账户首页表格区
 */
// 模拟数据
const mockTableDataList = reactive([
  {
    accountId: "1749460572914696",
    accountName: "思明育才-军队文职1",
    companyName: "步前程教育科技(北京)有限公司",
    state: 1,
    synchronizedSwitch: 1,
    synchronizedPath: "教育培训/军队文职",
  },
  {
    accountId: "1750616153126926",
    accountName: "思明育才-军队文职11",
    companyName: "步前程教育科技(北京)有限公司",
    state: 1,
    synchronizedSwitch: 1,
    synchronizedPath: "教育培训/军队文职",
  },
  {
    accountId: "1750616153771080",
    accountName: "思明育才-军队文职12",
    companyName: "步前程教育科技(北京)有限公司",
    state: 1,
    synchronizedSwitch: 0,
    synchronizedPath: "",
  },
]);
const handleAuthorization = (row: any) => {
  console.log("进行授权", row);
};
const changeSynchronizedSwitch = (val: any) => {
  console.log("切换同步开关", val);
  // @change="(checked: boolean) => handleTeamworkerSingleChange(checked, teamworker)"
};

/**
 * 存储路径级联表单
 */
const pathOptions = [
  {
    value: "教育培训",
    label: "教育培训",
    children: [{ value: "军队文职", label: "军队文职" }],
  },
  {
    value: "汽车",
    label: "汽车",
    children: [{ value: "汽车介绍", label: "汽车介绍" }],
  },
  {
    value: "书籍应用",
    label: "书籍应用",
    children: [
      { value: "懒懒听书", label: "懒懒听书" },
      { value: "书路阅读", label: "书路阅读" },
    ],
  },
];
const pathDialogVisible = ref(false);
const tempPathArr = ref<string[]>([]);
const originalPathStr = ref("教育培训/军队文职");
const openPathDialog = () => {
  console.log("openPathDialog");
  tempPathArr.value = originalPathStr.value.split("/");
  pathDialogVisible.value = true;
};
const saveChangePath = () => {
  console.log("saveChangePath");
  pathDialogVisible.value = false;
  console.log("originPath", originalPathStr.value);
  console.log("tempPath", tempPathArr.value);
  originalPathStr.value = tempPathArr.value.join("/");
};
const cancleChangePath = () => {
  console.log("cancleChangePath");
  pathDialogVisible.value = false;
};
const handlePathChange = (val: any) => {
  console.log("pathChange", val);
};
</script>

<style scoped lang="scss"></style>
