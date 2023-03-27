<template>
    <div class="userModify">
        <el-container>
            <el-header>
                <el-icon class="back-icon pointer" @click="back">
                    <ArrowLeft />
                </el-icon>
                <span> {{ CompanyStore.behavior === "add" ? "新增" : "编辑" }}运营快应用的企业主体信息 </span>
            </el-header>
            <el-main>
                <el-form ref="CompanyFormRef" :model="CompanyForm" :rules="CompanyFormRules" label-width="150px"
                    label-position="right">
                    <el-form-item label="公司全称" prop="companyName">

                        <el-input v-model="CompanyForm.companyName" placeholder="请输入公司全称" style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="公司简称" prop="companyAbbr">
                        <el-input v-model="CompanyForm.companyAbbr" placeholder="请输入公司简称" style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="公司标识" prop="companyIdentity">
                        <el-input v-model="CompanyForm.companyIdentity" placeholder="请输入公司标识"
                            style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用该公司" prop="enabled">
                        <el-radio-group v-model="CompanyForm.enabled" class="ml-4">
                            <el-radio :label="1" size="large">启用</el-radio>
                            <el-radio :label="0" size="large">停用</el-radio>
                        </el-radio-group>
                    </el-form-item>






                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="CompanyForm.remark" :rows="5" type="textarea" placeholder="请输入" />

                    </el-form-item>

                </el-form>
                <el-row>
                    <el-button @click="cancleModifyCompany">取消</el-button>
                    <el-button type="primary" v-throttle="() => saveModifyCompany(CompanyFormRef)">确定</el-button>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>
    
<script setup lang="ts">
import moment from 'moment';
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { useCompanyStore } from "@/store/company";
import { ArrowLeft } from "@element-plus/icons-vue";
import { onMounted, reactive, ref, computed, watch, nextTick } from "vue";
import {

    editCompanyApi,


} from "@/api/biz/company";

import { FormInstance, FormRules } from "element-plus";
import { useRouter, useRoute } from "vue-router";


//初始化
const router = useRouter();
const route = useRoute();

const CompanyFormRef = ref<FormInstance>();
let CompanyForm = reactive({
    companyId: <number>-1,

    companyName: <string>"",
    companyAbbr: <string>"",
    companyIdentity: <string>"",

    enabled: <number>0,//是否启用. 0-未启用; 1-已启用
    remark: <string>'',

});



const MScheduleShow = ref(false)

/* 校验相关 */
const validatecompanyName = (rule: any, value: string, callback: any) => {
    if (!value) return callback(new Error("请输入公司名称"));
    // debugger

    else return callback();
};
const validatecompanyAbbr = (rule: any, value: any, callback: any) => {
    if (!value) return callback(new Error("请输入公司简称"));

    else return callback();
};
const validatecompanyIdentity = (rule: any, value: any, callback: any) => {
    if (!value) return callback(new Error("请输入公司标识"));

    else return callback();
};

const CompanyFormRules = reactive<FormRules>({
    companyName: [{ validator: validatecompanyName, trigger: "blur" }],
    companyAbbr: [{ validator: validatecompanyAbbr, trigger: "blur" }],
    companyIdentity: [{ validator: validatecompanyIdentity, trigger: "blur" }],
});




const CompanyStore = useCompanyStore();
const cancleModifyCompany = () => {
    console.log("cancleModifyCompany", CompanyForm);
    router.back();
};

const beforeSubmit = () => {

}
const saveModifyCompany = async (formEl: FormInstance | undefined) => {
    console.log("saveModifyCompany", formEl);
    if (CompanyStore.behavior !== "modify") {
        // 添加配置
        if (!formEl) return;
        await formEl.validate((valid, fields) => {
            if (valid) {
                console.log("submit", CompanyForm);


                beforeSubmit();
                editCompanyApi({
                    action: 0,//新增
                    ...CompanyForm
                }).then((res) => {
                    console.log("editCompanyApi", res);
                    if (res.code === 200) {
                        ElMessage.success("创建成功");
                        router.push("/operationSubjectConfiguration");

                    }
                });
            } else {
                console.log("error", fields);
            }
        });
    } else {
        // 修改配置
        if (!formEl) return;
        await formEl.validate((valid, fields) => {
            if (valid) {

                beforeSubmit();
                editCompanyApi({
                    action: 1,//编辑修改
                    ...CompanyForm
                }).then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("修改成功");
                        router.push("/operationSubjectConfiguration");
                    }
                });
            } else {
                console.log("error", fields);
            }
        });
    }
};

onMounted(() => {
    if (CompanyStore.behavior === "modify") {
        // debugger
        CompanyForm = Object.assign(CompanyForm, CompanyStore.modifyCompanyInfo);

        // debugger
    } else {

    }
    nextTick(() => {
        MScheduleShow.value = true;
        // nextTick(() => {
        //   // debugger

        // })
    })
});

const back = () => {
    console.log("back");
    router.back();
};
</script>
    
<style scoped lang="scss">
:deep(.avatar-uploader) {

    .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
        border-color: var(--el-color-primary);
    }

}



.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

.userModify {
    font-size: 14px;
    height: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
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

.el-container {
    height: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
}
</style>
    