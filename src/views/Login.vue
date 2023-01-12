<template>
  <div class="login" :style="'background-image: url(' + Background + ')'">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="login-form-title" @click="test">广告素材后台</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="账号" :prefix-icon="User"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" placeholder="密码" type="password" :prefix-icon="Lock"></el-input>
      </el-form-item>
      <!-- 带验证码的登录 -->
      <!-- <el-form-item prop="code" v-if="loginForm.type === 2">
        <el-input v-model="loginForm.code" placeholder="验证码" :prefix-icon="Checked" class="login-form-code"></el-input>
        <img :src="codeUrl" @click="getCode" class="login-form-img" />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="submitLoginForm(loginFormRef)" class="login-form-button">登录</el-button>
      </el-form-item>
    </el-form>
    <span class="login-copyright">{{ loginPage.copyright }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { FormInstance } from "element-plus";
import Background from "@/assets/images/background.webp";
import { User, Lock } from "@element-plus/icons-vue";
import { login } from "@/api/login/login";
// import { User, Lock, Checked } from "@element-plus/icons-vue";
// import { captcha, login } from "@/api/login/login";
import { useGlobalStore } from "@/store/index";
import { useAuthStore } from "@/store/auth";
import { initDynamicRouter } from "@/router/dynamicRouter";

const test = () => {
  console.log(router);
};
const router = useRouter();
const globalStore = useGlobalStore();
const authStore = useAuthStore();

/**
 * 验证码登录
 */
// const codeUrl = ref("");
// const getCode = () => {
//   captcha().then((res) => {
//     codeUrl.value = res.data.img;
//     loginForm.captchaId = res.data.captchaId;
//   });
// };
// getCode();

const loginFormRef = ref<FormInstance>();
const loginForm = reactive({
  username: "",
  password: "",
  type: 1,
  // captchaId: "",
  // code: "",
});
const validateUserName = (rule: any, value: string, callback: any) => {
  if (value.trim() === "") {
    return callback(new Error("请输入用户名"));
  } else {
    callback();
  }
};
const validatePassword = (rule: any, value: string, callback: any) => {
  if (value.trim() === "") {
    return callback(new Error("请输入密码"));
  } else {
    callback();
  }
};
const validateCode = (rule: any, value: string, callback: any) => {
  if (value.trim() === "") {
    return callback(new Error("验证码不能为空"));
  } else {
    callback();
  }
};
const loginRules = reactive({
  username: [{ validator: validateUserName, trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
  code: [{ validator: validateCode, trigger: "blur" }],
});
const submitLoginForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      login({ ...loginForm })
        .then(async (res) => {
          globalStore.setToken(res.data.token);
          // globalStore.setUsername(res.data.userInfoVo.sysUser.username);
          // globalStore.setRole(res.data.userInfoVo.sysRoleList[0].name);
          // globalStore.setDept(res.data.userInfoVo.deptTreeVoList[0].name);
          authStore.setAuthMenuList(res.data.userInfoVo.menuVoList);
          authStore.getAuthButtonList();
          console.log("show", authStore.showMenuListGet);
          await initDynamicRouter();
          // console.log("d", d);
          // d.forEach((i: any) => {
          //   router.addRoute(i);
          // });
          console.log("login router", router.options.routes);
          console.log("router get", router.getRoutes());
          router.push("/report");
        })
        .catch((err) => {
          console.log("login 接口错误", err);
        });
      // router.push("/info");
    } else {
      return false;
    }
  });
};

const loginPage = reactive({
  copyright: "Copyright © 2022 Weiyankeji. All rights reserved.",
});
</script>

<style scoped lang="scss">
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
  &-form {
    box-sizing: border-box;
    padding: 25px 25px 5px;
    border-radius: 6px;
    width: 385px;
    background-color: #ffffff;
    &-title {
      margin: 0 auto 30px;
      text-align: center;
      color: #707070;
    }
    &-code {
      width: 63%;
    }
    &-img {
      position: absolute;
      right: 0;
      cursor: pointer;
    }
    &-button {
      margin-top: 10px;
      width: 100%;
      height: 38px;
    }
    .el-input {
      height: 38px;
      input {
        height: 38px;
      }
    }
  }
  &-copyright {
    position: fixed;
    bottom: 0;
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    color: #ffffff;
  }
}
</style>
