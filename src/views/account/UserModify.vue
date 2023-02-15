<template>
  <div class="userModify">
    <el-container>
      <el-header>
        <el-icon class="back-icon pointer" @click="back"><ArrowLeft /></el-icon>
        <span> {{ accountStore.behaviorGet === "add" ? "添加" : "修改" }}人员 </span>
      </el-header>
      <el-main>
        <el-form ref="userFormRef" :model="userForm" :rules="userFormRules" label-width="100px" label-position="left">
          <el-form-item label="用户账号" prop="userName">
            <div v-if="accountStore.behavior === 'modify' && accountStore.modifyUserInfo.userName">{{ userForm.userName }}</div>
            <el-input v-else v-model="userForm.userName" placeholder="请输入5-20位英文+数字组合的账号"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="nickName">
            <el-input v-model="userForm.nickName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="邮箱号码" prop="email">
            <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="userForm.password"
              type="password"
              show-password
              placeholder="长度须大于6位数，同时包含数字、字母"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="roleIdList">
            <el-checkbox-group v-model="userForm.roleIdList">
              <el-checkbox :label="role.id" v-for="role in OptionalRoleList" :key="role.id">{{ role.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="所属部门" prop="deptId">
            <el-select v-model="userForm.deptId" placeholder="请选择">
              <el-option v-for="d in OptionalDeptList" :key="d.id" :label="d.name" :value="d.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-row>
          <el-button @click="cancleModifyUser">取消</el-button>
          <el-button type="primary" @click="saveModifyUser(userFormRef)">确定</el-button>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useAccountStore } from "@/store/account";
import { ArrowLeft } from "@element-plus/icons-vue";
import { onMounted, reactive, ref } from "vue";
import { getRoleListApi } from "@/api/system/role";
import { getDeptTreeApi } from "@/api/system/dept";
import { postCreateUserApi, postUpdateUserApi } from "@/api/system/user";
import { FormInstance, FormRules } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const userFormRef = ref<FormInstance>();
const userForm = reactive({
  userName: "",
  nickName: "",
  email: "",
  password: "",
  roleIdList: <number[]>[],
  deptId: <null | number>null,
});
const OptionalRoleList = ref<any>([]);
const OptionalDeptList = ref<any>([]);
const validateUserName = (rule: any, value: any, callback: any) => {
  if (accountStore.behavior === "modify" && accountStore.modifyUserInfo.userName) return callback();
  if (!value) return callback(new Error("请输入账号"));
  const regexp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{5,20}$/;
  if (!regexp.test(value)) callback(new Error("账号必须包含字母和数字，且在5~20位之间"));
  else return callback();
};
const validateNickName = (rule: any, value: any, callback: any) => {
  if (!value) return callback(new Error("请输入姓名"));
  if (value.length > 20) callback(new Error("姓名不得超过20字"));
  else return callback();
};
const validateEmail = (rule: any, value: any, callback: any) => {
  if (!value) return callback(new Error("请输入邮箱"));
  const regexp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regexp.test(value)) callback(new Error("请输入正常的邮箱号"));
  else return callback();
};
const validatePass = (rule: any, value: any, callback: any) => {
  if (accountStore.behavior === "modify") return callback();
  if (!value) return callback(new Error("请输入密码"));
  const regexp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
  if (!regexp.test(value)) callback(new Error("密码必须包含字母和数字，且在6~20位之间"));
  else return callback();
};
const validateRole = (rule: any, value: any, callback: any) => {
  if (accountStore.behavior === "modify") return callback();
  if (!value || (Array.isArray(value) && !value.length)) return callback(new Error("请至少选择一个角色"));
  else return callback();
};
const validateDept = (rule: any, value: any, callback: any) => {
  if (!value) return callback(new Error("请至少选择一个部门"));
  else return callback();
};

const userFormRules = reactive<FormRules>({
  userName: [{ validator: validateUserName, trigger: "blur" }],
  nickName: [{ validator: validateNickName, trigger: "blur" }],
  email: [{ validator: validateEmail, trigger: "blur" }],
  password: [{ validator: validatePass, trigger: "blur" }],
  roleIdList: [{ validator: validateRole, trigger: "change" }],
  deptId: [{ validator: validateDept, trigger: "change" }],
});

getRoleListApi().then((res) => {
  let roleNameList = ["管理员", "项目负责人", "编导", "摄像", "剪辑"];
  OptionalRoleList.value = res.data.list.filter((role: any) => roleNameList.includes(role.name)).reverse();
});
getDeptTreeApi().then((res) => {
  console.log("RES", res.data);
  OptionalDeptList.value = res.data[0].childrenList;
});

const accountStore = useAccountStore();
const cancleModifyUser = () => {
  console.log("cancleModifyUser", userForm);
  router.back();
};
const saveModifyUser = async (formEl: FormInstance | undefined) => {
  console.log("saveModifyUser", formEl);
  if (accountStore.behavior !== "modify") {
    // 添加人员
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log("submit", userForm);
        postCreateUserApi(userForm).then((res) => {
          console.log("postCreateUserApi", res);
          if (res.code === 200) ElMessage.success("创建成功");
        });
      } else {
        console.log("error", fields);
      }
    });
  } else {
    // 修改人员
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        let updateUserParams = {
          ...userForm,
          userId: accountStore.userInfoGet.userId,
          enabled: accountStore.userInfoGet.enabled,
        };
        // console.log("submit", userForm);
        postUpdateUserApi(updateUserParams).then((res) => {
          // console.log("postUpdateUserApi", res);
          if (res.code === 200) ElMessage.success("修改成功");
        });
      } else {
        console.log("error", fields);
      }
    });
  }
};

onMounted(() => {
  if (accountStore.behavior === "modify") {
    const { userName, nickName, email, roleList, deptId } = accountStore.modifyUserInfo;
    if (userName) userForm.userName = userName;
    if (nickName) userForm.nickName = nickName;
    if (email) userForm.email = email;
    if (roleList) userForm.roleIdList = roleList.map((role) => role.roleId);
    if (deptId) userForm.deptId = deptId;
  }
});

const back = () => {
  console.log("back");
  router.back();
};
</script>

<style scoped lang="scss">
.userModify {
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
</style>
