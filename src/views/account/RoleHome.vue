<template>
  <div class="roleHome">
    <el-table :data="tableData" class="table" :header-cell-style="{ backgroundColor: '#f2f2f2', fontSize: '14px' }">
      <el-table-column label="角色名称" prop="roleName" width="160px"></el-table-column>
      <el-table-column label="人员" prop="userList">
        <template #default="scope">
          <div>{{ scope.row.userList ? scope.row.userList : "--" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <div @click="jumpToRoleModify(scope.row)" class="theme-color pointer">编辑</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { getRoleUserListApi } from "@/api/system/user";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAccountStore } from "@/store/account";

const tableData = ref<any>([]);
const router = useRouter();
const accountStore = useAccountStore();
onMounted(() => {
  getRoleUserListApi().then((res) => {
    console.log("getRoleUserListApi", res);
    res.data.forEach((role: any) => {
      let curRole = tableData.value.find((r: any) => r.roleId === role.roleId);
      const { userId, userName, userNickName, roleId, roleName } = role;
      let u = { userId, userName, userNickName };
      if (curRole) {
        curRole.userList.push(u);
      } else {
        let r = { roleId, roleName, userList: [u] };
        tableData.value.push(r);
      }
    });
    let roleNameList = ["管理员", "项目负责人", "编导", "摄像", "剪辑"];
    tableData.value.forEach((r: any) => {
      r.userList = r.userList.map((u: any) => u.userNickName).join("、");
    });
    tableData.value = tableData.value.filter((r: any) => roleNameList.includes(r.roleName));
  });
});
const jumpToRoleModify = (row: any) => {
  console.log("jumpToRoleModify", row);
  accountStore.setRoleId(row.roleId);
  accountStore.setRoleName(row.roleName);
  router.push({
    path: "/account/role_modify",
  });
  console.log("accountStore", accountStore);
};
</script>

<style scoped lang="scss">
.theme-color {
  color: var(--el-color-primary);
}
</style>
