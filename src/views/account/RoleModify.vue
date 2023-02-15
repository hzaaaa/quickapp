<template>
  <div class="roleModify">
    <el-container>
      <el-header>
        <el-icon class="back-icon pointer" @click="back"><ArrowLeft /></el-icon>
        <span>编辑角色权限</span>
      </el-header>
      <el-main>
        <el-row>
          <span class="label">角色名称</span>
          <span class="name">{{ accountStore.modifyRoleName }}</span>
        </el-row>
        <el-row>
          <span class="label">角色权限</span>
        </el-row>
        <el-scrollbar height="500px">
          <el-tree
            ref="treeRef"
            :data="menuTree"
            show-checkbox
            default-expand-all
            node-key="id"
            :props="{ children: 'childrenList', label: 'title' }"
          />
        </el-scrollbar>
        <el-row class="save-button">
          <el-button type="primary" @click="save">保存</el-button>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { getRoleInfoApi } from "@/api/system/role";
import { useAccountStore } from "@/store/account";
import { getMenuTreeApi } from "@/api/system/menu";
import { getRoleMenuDetailsByRoleId } from "@/api/biz/account";
import { onMounted, ref } from "vue";
import { ArrowLeft } from "@element-plus/icons-vue";
import { postRoleUpdateApi } from "@/api/system/role";
import { useRouter } from "vue-router";

const router = useRouter();

const treeRef = ref<any>();
const accountStore = useAccountStore();
const menuTree = ref<any>([]);
onMounted(async () => {
  getRoleInfoApi({ id: accountStore.modifyRoleId }).then((res) => {
    console.log("getRoleInfoApi", res);
  });
  await getMenuTreeApi({ menuId: 1 }).then((res) => {
    console.log("getMenuTreeApi", res);
    let hiddenList = ["部门设置", "菜单设置", "角色设置", "用户设置"];
    menuTree.value = res.data[0].childrenList.filter((m: any) => !hiddenList.includes(m.title));
    console.log("menuTree", menuTree.value);
  });
  getRoleMenuDetailsByRoleId({ roleId: accountStore.modifyRoleId }).then((res) => {
    console.log("getRoleMenuDetailsByRoleId", res.data);
    res.data.forEach((role: any) => {
      treeRef.value.setChecked(role.menuId, true, false);
    });
  });
});
const save = () => {
  // console.log("getCheckedKeys", treeRef.value.getCheckedKeys(false));
  // console.log("getHalfCheckedKeys", treeRef.value.getHalfCheckedKeys());
  // console.log("modifyRoleId", accountStore.modifyRoleId);
  let roleUpdateParams = {
    id: accountStore.modifyRoleId,
    menuIdList: treeRef.value.getCheckedKeys(false).concat(treeRef.value.getHalfCheckedKeys()),
  };
  postRoleUpdateApi(roleUpdateParams).then((res) => {
    console.log("postRoleUpdateApi", res);
    if (res.code === 200) {
      ElMessage.success("编辑成功！");
    }
  });
  // console.log("roleParams, ", roleUpdateParams);
};
const back = () => {
  console.log("back");
  router.back();
};
</script>

<style scoped lang="scss">
.roleModify {
  font-size: 14px;
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
.label {
  margin-right: 16px;
  line-height: 40px;
  font-weight: 700;
}
.name {
  line-height: 40px;
}
.save-button {
  display: flex;
  align-items: center;
  height: 60px;
}
</style>
