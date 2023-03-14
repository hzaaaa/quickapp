<template>
    <div class="userModify">
      <el-container>
        <el-header>
          <el-icon class="back-icon pointer" @click="back"><ArrowLeft /></el-icon>
          <span> {{ route.query.type === "add" ? "新增" : "编辑" }}一个快应用的配置 </span>
        </el-header>
        <el-main>
          <el-form ref="userFormRef" :model="userForm" :rules="userFormRules" label-width="150px" label-position="left">
            <el-form-item label="快应用名称" prop="userName">
              <div v-if="route.query.type === 'modify' && accountStore.modifyUserInfo.userName">{{ userForm.userName }}</div>
              <el-input
                v-else
                v-model="userForm.userName"
                placeholder="请输入5-20位英文+数字组合的快应用名称"
                style="width: 300px"
              ></el-input>
            </el-form-item>
            <el-form-item label="快应用包名" prop="nickName">
              <el-input v-model="userForm.nickName" placeholder="请输入快应用包名" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item label="所属公司主体" prop="deptId">
              <el-select v-model="userForm.deptId" placeholder="请选择" style="width: 300px">
                <el-option v-for="d in OptionalDeptList" :key="d.id" :label="d.name" :value="d.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="已上架手机" prop="roleIdList">
              <el-checkbox-group v-model="userForm.roleIdList">
                <el-checkbox :label="role.id" v-for="role in OptionalRoleList" :key="role.id">{{ role.name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="已开通广告的手机" prop="roleIdList">
              <el-checkbox-group v-model="userForm.roleIdList">
                <el-checkbox :label="role.id" v-for="role in OptionalRoleList" :key="role.id">{{ role.name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="启动运营的手机" prop="roleIdList">
              <el-checkbox-group v-model="userForm.roleIdList">
                <el-checkbox :label="role.id" v-for="role in OptionalRoleList" :key="role.id">{{ role.name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="关联的投放媒体标识" prop="deptId2">
              <el-select
                multiple
                collapse-tags
                collapse-tags-tooltip
                v-model="userForm.deptId2" 
                placeholder="请选择" style="width: 300px">
                <el-option v-for="d in OptionalDeptList" :key="d.id" :label="d.name" :value="d.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="以下城市不投放" prop="roleIdList">
              <el-checkbox-group v-model="userForm.roleIdList">
                <el-checkbox :label="role.id" v-for="role in OptionalRoleList" :key="role.id">{{ role.name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>


            <el-form-item label="邮箱号码" prop="email">
                <MSchedule @receive="onReceive" :curValue="curValue" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="userForm.password"
                type="password"
                show-password
                placeholder="长度须大于6位数，同时包含数字、字母"
                style="width: 300px"
              ></el-input>
              <span class="tips">填写并确认后，该账号密码将重置</span>
            </el-form-item>
            <el-form-item label="已上架手机" prop="roleIdList">
              <el-checkbox-group v-model="userForm.roleIdList">
                <el-checkbox :label="role.id" v-for="role in OptionalRoleList" :key="role.id">{{ role.name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="所属公司主体" prop="deptId">
              <el-select v-model="userForm.deptId" placeholder="请选择" style="width: 300px">
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
  import { MSchedule } from '@bytedance-ad/mui-vue3';
  import { useAccountStore } from "@/store/account";
  import { ArrowLeft } from "@element-plus/icons-vue";
  import { onMounted, reactive, ref } from "vue";
  import { getRoleListApi } from "@/api/system/role";
  import { getDeptTreeApi } from "@/api/system/dept";
  import { postCreateUserApi, postUpdateUserApi } from "@/api/system/user";
  import { FormInstance, FormRules } from "element-plus";
  import { useRouter,useRoute } from "vue-router";

  const curValue = ref({
    schedule_time: ''
  })
  const onReceive = (value:any) => {
  // 不能缺少这一步
  debugger
    curValue.value = value
  };
  
  const router = useRouter();
  const route = useRoute();
  


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
    if (route.query.type === "modify" && accountStore.modifyUserInfo.userName) return callback();
    if (!value) return callback(new Error("请输入账号"));
    const regexp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{5,20}$/;
    if (!regexp.test(value)) callback(new Error("账号必须包含字母和数字，且在5~20位之间"));
    else return callback();
  };
  const validateNickName = (rule: any, value: any, callback: any) => {
    if (!value) return callback(new Error("请输入快应用包名"));
    if (value.length > 20) callback(new Error("快应用包名不得超过20字"));
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
    if (route.query.type === "modify") return callback();
    if (!value) return callback(new Error("请输入密码"));
    const regexp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
    if (!regexp.test(value)) callback(new Error("密码必须包含字母和数字，且在6~20位之间"));
    else return callback();
  };
  const validateRole = (rule: any, value: any, callback: any) => {
    // if (route.query.type === "modify") return callback();
    if (!value || (Array.isArray(value) && !value.length)) return callback(new Error("请至少选择一个已上架手机"));
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
    let roleNameList = ["管理员", "项目负责人", "编导", "摄像", "剪辑", "运营"];
    // OptionalRoleList.value = res.data.list.filter((role: any) => roleNameList.includes(role.name)).reverse();
    OptionalRoleList.value = res.data.list
      .filter((role: any) => roleNameList.includes(role.name))
      .sort((a: any, b: any) => a.id - b.id);
  });
  getDeptTreeApi({ id: 8 }).then((res) => {
    OptionalDeptList.value = res.data[0].childrenList;
  });
  
  const accountStore = useAccountStore();
  const cancleModifyUser = () => {
    console.log("cancleModifyUser", userForm);
    router.back();
  };
  const saveModifyUser = async (formEl: FormInstance | undefined) => {
    console.log("saveModifyUser", formEl);
    if (route.query.type !== "modify") {
      // 添加人员
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          console.log("submit", userForm);
          postCreateUserApi(userForm).then((res) => {
            console.log("postCreateUserApi", res);
            if (res.code === 200) {
              ElMessage.success("创建成功");
              router.push("/account/user");
            }
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
          let { password, ...otherUserForm } = userForm; // eslint-disable-line
          let updateUserParams = <any>{
            ...otherUserForm,
            userId: accountStore.userInfoGet.userId,
            enabled: accountStore.userInfoGet.enabled,
          };
          if (password) updateUserParams.password = password;
          postUpdateUserApi(updateUserParams).then((res) => {
            if (res.code === 200) {
              ElMessage.success("修改成功");
              router.push("/account/user");
            }
          });
        } else {
          console.log("error", fields);
        }
      });
    }
  };
  
  onMounted(() => {
    if (route.query.type === "modify") {
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
  .tips {
    margin-left: 16px;
    color: var(--el-text-color-placeholder);
  }
  </style>
  