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
                <el-tabs @tab-click="resizeEcharts" v-model="activeTab" class="flex-1" style="min-width: 100px">
                    <el-tab-pane label="今日数据" name="今日数据">

                        <div>日期：2023-04-21</div>
                        <echartsTable type="1" ref="ET1"></echartsTable>

                    </el-tab-pane>
                    <el-tab-pane label="昨日数据" name="昨日数据">
                        <div>日期：2023-04-22</div>
                        <echartsTable type="2" ref="ET2"></echartsTable>
                    </el-tab-pane>
                    <el-tab-pane label="最近七日数据" name="最近七日数据">
                        <div>日期：2023-04-22</div>
                        <!-- <echartsTable type="2" ref="ET2"></echartsTable> -->
                    </el-tab-pane>
                    <el-tab-pane label="最近一个月数据" name="最近一个月数据">
                        <div>日期：2023-04-22</div>
                        <!-- <echartsTable type="2" ref="ET2"></echartsTable> -->
                    </el-tab-pane>
                    <el-tab-pane label="自定义查询范围" name="自定义查询范围">
                        <div>日期：2023-04-22</div>
                        <!-- <echartsTable type="2" ref="ET2"></echartsTable> -->
                    </el-tab-pane>
                </el-tabs>
                <!-- <el-button-group>
                    <el-button :type="activeTab === 1 ? 'primary' : ''" plain @click="activeTab = 1">1</el-button>
                    <el-button :type="activeTab === 2 ? 'primary' : ''" plain @click="activeTab = 2">2</el-button>
                </el-button-group>
                <div class="" v-show="activeTab === 1">
                    <div>日期：2023-04-21</div>
                    <echartsTable class="one"></echartsTable>
                </div>
                <div v-show="activeTab === 2">
                    <div>日期：2023-04-11</div>
                    <echartsTable class="two"></echartsTable>
                </div> -->
            </el-main>
        </el-container>
    </div>
</template>
  
<script setup lang="ts">
import { useAccountStore } from "@/store/account";
import { ArrowLeft } from "@element-plus/icons-vue";
import { onMounted, reactive, ref, getCurrentInstance, nextTick } from "vue";
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

let activeTab = ref('今日数据');
let ET1 = ref<any>(null);
let ET2 = ref<any>(null);

let resizeEcharts = () => {
    // debugger
    nextTick(() => {
        ET1.value?.resizeCharts();
        ET2.value?.resizeCharts();
    })

}

const OptionalRoleList = ref<any>([]);
const OptionalDeptList = ref<any>([]);




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
    height: 0 !important;
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;

    section {
        height: 0 !important;
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;

        main {
            height: 0 !important;
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;


        }
    }
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
  