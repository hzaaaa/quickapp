<template>
    <div class="userModify">
        <el-container>
            <el-header>
                <el-icon class="back-icon pointer" @click="back">
                    <ArrowLeft />
                </el-icon>
                <span>快应用【{{ '奇域小说' }}】运营数据汇总：</span>
            </el-header>
            <el-main>
                <el-tabs v-model="activeTab" type="card" class="flex-1" style="min-width: 100px">
                    <el-tab-pane :label="1" :name="1">
                        <div>日期：2023-04-21</div>
                        <echartsTable></echartsTable>

                    </el-tab-pane>
                    <el-tab-pane :label="2" :name="2">2</el-tab-pane>
                </el-tabs>
                <!-- <echartsTable></echartsTable> -->
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
import echartsTable from './echartsTable.vue'

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

let activeTab = ref(1)

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
    // if (accountStore.behavior === "modify") return callback();
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
    let roleNameList = ["管理员", "项目负责人", "编导", "摄像", "剪辑", "运营"];
    // OptionalRoleList.value = res.data.list.filter((role: any) => roleNameList.includes(role.name)).reverse();
    OptionalRoleList.value = res.data.list
        .filter((role: any) => roleNameList.includes(role.name))
        .sort((a: any, b: any) => a.id - b.id);
});
getDeptTreeApi({ id: 1 }).then((res) => {
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
                    if (res.code === 200) {
                        ElMessage.success("创建成功");
                        router.push("/userAndRole");
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
                let {
                    password,
                    ...otherUserForm } = userForm; // eslint-disable-line
                let updateUserParams = <any>{
                    ...otherUserForm,
                    userId: accountStore.userInfoGet.userId,
                    enabled: accountStore.userInfoGet.enabled,
                };
                if (password) updateUserParams.password = password;
                postUpdateUserApi(updateUserParams).then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("修改成功");
                        router.push("/userAndRole");
                    }
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
    } else {
        //添加用户时默认为普通管理员 id:2 
        userForm.roleIdList = [2];
        userForm.password = '123456';

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
  