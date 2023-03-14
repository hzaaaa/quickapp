<template>
  <div class="login" :style="'background-image: url(' + Background + ')'">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="login-form-title">快应用投放配置管理系统</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入账号" :prefix-icon="User"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" placeholder="请输入密码" type="password" :prefix-icon="Lock"></el-input>
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
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { FormInstance } from "element-plus";
import Background from "@/assets/images/login-bg.jpg";
import { User, Lock } from "@element-plus/icons-vue";
import { loginApi } from "@/api/login/login";
// import { User, Lock, Checked } from "@element-plus/icons-vue";
// import { captcha, loginApi } from "@/api/login/login";
import { useGlobalStore } from "@/store/index";
import { useAuthStore } from "@/store/auth";
import { initDynamicRouter } from "@/router/dynamicRouter";
import { getFisrtRoute } from "@/utils/util";

const router = useRouter();
const route = useRoute();
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
      // 0. 清空缓存
      globalStore.$reset();
      // 1. 执行登录接口
      loginApi({ ...loginForm })
        .then(async (res) => {
          // 2. 存储用户信息
          globalStore.setToken(res.data.token);
          globalStore.setUserId(res.data.userInfoVo?.sysUser?.id);
          globalStore.setUsername(res.data.userInfoVo?.sysUser?.username);
          globalStore.setNickname(res.data.userInfoVo?.sysUser?.nickName);
          globalStore.setEmail(res.data.userInfoVo?.sysUser?.email);
          globalStore.setRole(res.data.userInfoVo?.sysRoleList.map((r: any) => r.name).join("、"));
          globalStore.setRoleCode(res.data.userInfoVo?.sysRoleList.map((r: any) => r.code));
          // if (res.data.userInfoVo?.deptTreeVoList[0]?.childrenList) {
          //   globalStore.setDept(res.data.userInfoVo.deptTreeVoList[0].childrenList.map((d: any) => d.name).join("、"));
          // } else {
          //   globalStore.setDept(res.data.userInfoVo?.deptTreeVoList[0]?.name);
          // }
          // 如果 menuVoList 带id=1的系统设置，则所有其他菜单均为系统设置的子菜单，只存储子菜单列表
          // debugger
          if (res.data.userInfoVo?.menuVoList[0].id === 1) {
            authStore.setOriginAuthMenuList(res.data.userInfoVo?.menuVoList[0].childrenList);
          } else {
            // 若第一项id!==1，说明不带系统设置，已是子菜单列表，直接存储
            authStore.setOriginAuthMenuList(res.data.userInfoVo?.menuVoList);
          }

          // 3. 获取按钮权限
          authStore.getAuthButtonList();

          // 4. 添加动态路由
          await initDynamicRouter();

          router.push( "/configQuickApp" );
          // router.push('/');
          // 5.跳转页面，如果没有 redirect 跳转到默认页，如果有就携带参数跳转到 redirect
          // if (!route.query?.redirect) router.push(getFisrtRoute(authStore.authMenuListGet));
          // else if (route.query?.redirect === "/library") router.push({ name: "library" });
          // else if (route.query?.redirect === "/report") router.push({ name: "report" });
          // else router.push({ path: route.query?.redirect as string, query: JSON.parse(route.query?.params as string) });
        })
        .catch((err) => {
          console.log("loginApi 接口错误", err);
        });
    } else {
      return false;
    }
  });
};
onMounted(() => {
  // 监听 enter 按键事件登录
  document.onkeydown = (e: any) => {
    e = window.event || e;
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      submitLoginForm(loginFormRef.value);
    }
  };
});

const loginPage = reactive({
  copyright: "Copyright © 2023 Weiyankeji. All rights reserved.",
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
