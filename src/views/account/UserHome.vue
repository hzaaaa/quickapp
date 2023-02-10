<template>
  <div class="userHome">
    <el-container>
      <el-aside width="240px">
        <el-menu class="dept-menu">
          <template v-for="dept in deptTree" :key="dept.id">
            <!-- 项目列表不为空的使用 el-sub-menu -->
            <el-sub-menu :index="`${dept.id}`" v-if="dept.childrenList && dept.childrenList.length" class="dept-menu-sub">
              <template #title>
                <span>{{ dept.name }}</span>
              </template>
              <el-menu-item
                :index="`${subDept.id}`"
                @click="test"
                class="aside-item"
                v-for="subDept in dept.childrenList"
                :key="subDept.id"
              >
                <span>{{ subDept.name }}</span>
              </el-menu-item>
            </el-sub-menu>
            <!-- 项目列表为空的使用 el-menu-item -->
            <el-menu-item :index="`${dept.id}`" @click="test" v-else>
              <span>{{ dept.name }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <el-row class="filter">
          <div class="filter-label">账户状态</div>
          <el-select v-model="searchForm.enabled" class="filter-input">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="停用" :value="0"></el-option>
          </el-select>
          <div class="filter-label">用户账号</div>
          <el-input v-model="searchForm.companyName" class="filter-input"></el-input>
          <el-button type="primary" @click="search">查询</el-button>
        </el-row>
        <el-button plain type="primary" @click="jumpToAddUser">添加人员</el-button>
        <el-config-provider :locale="zhCn">
          <el-table :data="tableDataList" class="table" :header-cell-style="{ backgroundColor: '#f2f2f2', fontSize: '14px' }">
            <el-table-column label="人员ID" prop="userId"></el-table-column>
            <el-table-column label="用户账号" prop="userName"></el-table-column>
            <el-table-column label="姓名" prop="nickName"></el-table-column>
            <el-table-column label="角色" width="80px">
              <template #default="scope">
                {{ scope.row.roleList.map((r: any) => r.roleName).join("、") }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="80px">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  :active-value="1"
                  :inactive-value="0"
                  @change="changeEnabled"
                  size="small"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="所属部门" prop="deptName"> </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <div @click="jumpToModifyUser(scope.row)" class="pointer">
                  <span>修改</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="媒体账户">
              <template #default="scope">
                <div @click="jumpToAssignUser(scope.row)" class="pointer">
                  <span>分配</span>
                </div>
                <div @click="jumpToPeekUser(scope.row)" class="pointer">
                  <span>查看</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-config-provider>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { getDeptTreeApi } from "@/api/system/dept";
import { postGetUserListByFormApi } from "@/api/system/user";
import { useAccountStore } from "@/store/account";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

const router = useRouter();
const accountStore = useAccountStore();
/**
 * 部门树
 */
const deptTree = ref<any>([]);
// v1 版本中没有根据用户id查得所有公司deptId的接口，临时写死id=8
let tempCompanyDeptId = 8;
let tempAdminRoleId = 10;
getDeptTreeApi({ id: tempCompanyDeptId }).then((res) => {
  deptTree.value = res.data;
});
// v1 版本中没有查得直接查得超级管理员用户的接口，临时通过前端过滤出超级管理员用户
postGetUserListByFormApi({ deptId: tempCompanyDeptId }).then((res) => {
  tableDataList.value = res.data.filter((u: any) => u.roleList.find((r: any) => r.roleId === tempAdminRoleId));
});

const test = (a: any) => {
  console.log("test", a.index);
  postGetUserListByFormApi({ deptId: a.index }).then((res) => {
    console.log("res", res.data);
    tableDataList.value = res.data;
  });
};

/**
 * 搜索区
 */
const searchForm = reactive({
  enabled: 1,
  companyName: "",
});
const search = () => {
  console.log("search");
};
const jumpToAddUser = () => {
  console.log("jumpToAddUser");
  router.push("/account/user_modify");
  accountStore.setBehavior("add");
};

/**
 * 人员表格
 */
const tableDataList = ref<any[]>([]);
const jumpToModifyUser = (row: any) => {
  console.log("jumpToModifyUser", row);
  router.push("/account/user_modify");
  accountStore.setBehavior("modify");
  accountStore.setUserInfo(row);
};
const jumpToAssignUser = (row: any) => {
  console.log("jumpToAssignUser", row);
  router.push("/account/user_assign");
};
const jumpToPeekUser = (row: any) => {
  console.log("jumpToAssignUser", row);
  router.push("/account/user_peek");
};
const changeEnabled = (a: any) => {
  console.log("changeEnabled", a);
};
</script>

<style scoped lang="scss">
.userHome {
  height: 100%;
  font-size: 14px;
  .el-container {
    height: 100%;
    .el-aside {
      border-right: 1px solid #f2f2f2;
    }
  }
}
.dept-menu {
  :deep(span) {
    font-size: 10px;
  }
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
  margin-top: 8px;
  border-radius: 4px 4px 0 0;
  font-size: 12px;
}
</style>
