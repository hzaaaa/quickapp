<template>
  <div class="info">
    <div class="info-title">个人信息</div>
    <div class="info-content">
      <div>
        <span class="info-content-title">用户名</span>
        <span>{{ userInfoTemp.username }}</span>
      </div>
      <div>
        <span class="info-content-title">邮箱号码</span>
        <span>{{ userInfoTemp.email }}</span>
      </div>
      <div>
        <span class="info-content-title">密码</span>
        <span class="modify" @click="isPwdFormVisible = true">修改</span>
      </div>
      <div>
        <span class="info-content-title">角色</span>
        <span>{{ userInfoTemp.role }}</span>
      </div>
      <div>
        <span class="info-content-title">所属部门</span>
        <span>{{ userInfoTemp.departmant }}</span>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <el-dialog title="修改密码" width="500px" v-model="isPwdFormVisible" @closed="handlePwdFormClose">
      <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="100px">
        <el-form-item label="原始密码" prop="pwd_old">
          <el-input v-model="pwdForm.pwd_old" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pwd_new">
          <el-input v-model="pwdForm.pwd_new" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="pwdCheck">
          <el-input v-model="pwdCheck" type="password"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isPwdFormVisible = false">取消</el-button>
        <el-button @click="submitPwdForm(pwdFormRef)" type="primary">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { FormInstance } from "element-plus";
const userInfoTemp = ref({
  username: "张三",
  email: "zhangsan@weiyankeji.cn",
  role: "管理员",
  departmant: "运营部",
});

/**
 * 修改密码弹窗
 */
const isPwdFormVisible = ref(false);
const pwdFormRef = ref<FormInstance>();
const pwdForm = reactive({
  pwd_old: "",
  pwd_new: "",
});
const pwdCheck = ref("");
const validatePwdOld = (rule: any, value: string, callback: any) => {
  if (value.trim() === "") {
    callback(new Error("请输入原密码"));
  } else {
    callback();
  }
};
const validatePwdNew = (rules: any, value: string, callback: any) => {
  if (value.trim() === "") {
    callback(new Error("请输入密码"));
  } else if (!(/[a-zA-Z]+/.test(value) && /[0-9]+/.test(value) && value.length > 6)) {
    callback(new Error("长度须大于6位数，包含数字、字母"));
  } else {
    callback();
  }
};
const validatePwdCheck = (rules: any, value: string, callback: any) => {
  if (!pwdCheck.value || pwdCheck.value.trim() === "") {
    callback(new Error("请再次输入密码"));
  } else if (pwdCheck.value !== pwdForm.pwd_new) {
    callback(new Error("两次输入密码不一致"));
  } else {
    callback();
  }
};
const pwdRules = reactive({
  pwd_old: [{ validator: validatePwdOld, trigger: "blur", required: true }],
  pwd_new: [{ validator: validatePwdNew, trigger: "blur", required: true }],
  pwdCheck: [{ validator: validatePwdCheck, trigger: "blur", required: true }],
});
const submitPwdForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      isPwdFormVisible.value = false;
      ElMessage.success({ message: "密码已修改，请重新登录" });
      // let reqData: Password.ReqPasswordForm = {
      //   password: pwdForm.pwd_old,
      //   newPassword: pwdForm.pwd_new,
      // };
      // if (isFirstLogin.value) {
      //   reqData.firstLogin = true;
      // }
      // password(reqData)
      //   .then((res) => {
      //     if (res.code == "0") {
      //       isPwdFormVisible.value = false;
      //       ElMessage({ message: "密码已修改，请重新登录！", type: "success", showClose: true });
      //     }
      //   })
      //   .catch((err) => {
      //     console.error("password 接口 error=>", err);
      //   });
    } else {
      return false;
    }
  });
};
const handlePwdFormClose = () => {
  // console.log("close");
  resetPwd();
};
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
const resetPwd = () => {
  resetForm(pwdFormRef.value);
  pwdCheck.value = "";
};
</script>

<style scoped lang="scss">
.info {
  padding: 20px 20px 0;
  height: 100%;
  &-title {
    line-height: 60px;
    font-size: 20px;
  }
  &-content {
    margin-left: 40px;
    line-height: 60px;
    color: #333333;
    span {
      display: inline-block;
    }
    &-title {
      width: 200px;
    }
    .modify {
      cursor: pointer;
      color: var(--el-color-primary-dark-2);
    }
  }
}
</style>
