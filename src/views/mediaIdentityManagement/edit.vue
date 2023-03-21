<template>
    <div class="userModify">
        <el-container>
            <el-header>
                <el-icon class="back-icon pointer" @click="back">
                    <ArrowLeft />
                </el-icon>
                <span> {{ IdentityStore.behavior === "add" ? "新增" : "编辑" }}一个投放广告的媒体信息 </span>
            </el-header>
            <el-main>
                <el-form ref="IdentityFormRef" :model="IdentityForm" :rules="IdentityFormRules" label-width="150px"
                    label-position="right">
                    <el-form-item label="媒体名称" prop="mediaName">

                        <el-input :disabled="IdentityStore.behavior === 'modify'" v-model="IdentityForm.mediaName"
                            placeholder="请输入媒体名称" style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="媒体标识" prop="mediaIdentity">
                        <el-input v-model="IdentityForm.mediaIdentity" placeholder="请输入媒体标识"
                            style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="广告位的类型" prop="adsType">
                        <el-radio-group v-model="IdentityForm.adsType" class="ml-4">
                            <el-radio :label="0" size="large">Banner</el-radio>
                            <el-radio :label="1" size="large">弹窗</el-radio>
                            <el-radio :label="2" size="large">信息流</el-radio>
                            <el-radio :label="3" size="large">开屏</el-radio>
                            <el-radio :label="4" size="large">激励</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="广告素材链接" prop="adsLink">
                        <el-input v-model="IdentityForm.adsLink" placeholder="请输入广告素材链接" style="width: 300px"></el-input>
                    </el-form-item>
                    <el-form-item label="广告素材预览">
                        <el-image style="width: 300px; height: 200px" fit="contain" alt="暂无图片" :src="IdentityForm.adsLink">
                            <template #error>
                                <div class="image-slot">
                                    <el-icon><icon-picture /></el-icon>
                                </div>
                            </template>
                        </el-image>
                        <!-- <el-upload class="avatar-uploader"
                            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :show-file-list="false"
                            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                            <el-icon v-else class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload> -->
                    </el-form-item>
                    <el-form-item label="广告所在页面" prop="adsPageShow">
                        <el-radio-group v-model="IdentityForm.adsPageShow" class="ml-4">
                            <el-radio label="APP首屏" size="large">APP首屏</el-radio>
                            <el-radio label="网站首页" size="large">网站首页</el-radio>
                            <el-radio label="频道二级页" size="large">频道二级页</el-radio>
                            <el-radio label="其它" size="large">其它</el-radio>
                        </el-radio-group>
                        <el-input v-show="IdentityForm.adsPageShow === '其它'" v-model="IdentityForm.adsPageOther"
                            placeholder="" style="width: 120px;margin-left:15px"></el-input>
                    </el-form-item>
                    <el-form-item label="买量的量级" prop="purchasingQuantity">
                        <el-input-number :controls="false" v-model="IdentityForm.purchasingQuantity" placeholder="请输入买量的量级"
                            style="width: 300px;margin-right:15px"></el-input-number> PV / 天
                    </el-form-item>





                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="IdentityForm.remark" :rows="5" type="textarea" placeholder="请输入备注" />

                    </el-form-item>

                </el-form>
                <el-row>
                    <el-button @click="cancleModifyIdentity">取消</el-button>
                    <el-button type="primary" v-throttle="() => saveModifyIdentity(IdentityFormRef)">确定</el-button>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>
    
<script setup lang="ts">
import moment from 'moment';
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { useIdentityStore } from "@/store/identity";
import { ArrowLeft } from "@element-plus/icons-vue";
import { onMounted, reactive, ref, computed, watch, nextTick } from "vue";
import {

    editIdentityApi,


} from "@/api/biz/identity";

import { FormInstance, FormRules } from "element-plus";
import { useRouter, useRoute } from "vue-router";


//初始化
const router = useRouter();
const route = useRoute();

const IdentityFormRef = ref<FormInstance>();
let IdentityForm = reactive({
    identityId: <number>-1,

    mediaName: <string>"",
    mediaIdentity: <string>"",

    // companyId: <number | null>null,

    adsType: <number>0,//0-Banner;1-弹窗; 2-信息流; 3-开屏; 4-激励
    adsLink: <string>'',
    adsPage: <string>'',
    adsPageShow: <string>'',
    adsPageOther: <string>'',
    purchasingQuantity: <number | null>null,
    remark: <string>'',

});



const MScheduleShow = ref(false)

/* 校验相关 */
const validatemediaName = (rule: any, value: string, callback: any) => {
    // debugger
    if (IdentityStore.behavior === "modify" && IdentityStore.modifyIdentityInfo.mediaName) return callback();

    if (!value) return callback(new Error("请输入媒体名称"));
    // debugger
    if (value.length > 20) callback(new Error("媒体名称不得超过20字"));
    else return callback();
};
const validatemediaIdentity = (rule: any, value: any, callback: any) => {
    if (!value) return callback(new Error("请输入媒体标识"));

    else return callback();
};
const validatepurchasingQuantity = (rule: any, value: any, callback: any) => {
    if (!value) return callback(new Error("请输入买量的量级"));

    else return callback();
};




const IdentityFormRules = reactive<FormRules>({
    mediaName: [{ validator: validatemediaName, trigger: "blur" }],
    mediaIdentity: [{ validator: validatemediaIdentity, trigger: "blur" }],
    purchasingQuantity: [{ validator: validatepurchasingQuantity, trigger: "blur" }],


});




const IdentityStore = useIdentityStore();
const cancleModifyIdentity = () => {
    console.log("cancleModifyIdentity", IdentityForm);
    router.back();
};

const beforeSubmit = () => {

    if (IdentityForm.adsPageShow === '其它') {
        IdentityForm.adsPage = IdentityForm.adsPageOther
    } else {
        IdentityForm.adsPage = IdentityForm.adsPageShow
    }


}
const saveModifyIdentity = async (formEl: FormInstance | undefined) => {
    console.log("saveModifyIdentity", formEl);
    if (IdentityStore.behavior !== "modify") {
        // 添加配置
        if (!formEl) return;
        await formEl.validate((valid, fields) => {
            if (valid) {
                console.log("submit", IdentityForm);


                beforeSubmit();
                editIdentityApi({
                    action: 0,//新增
                    ...IdentityForm
                }).then((res) => {
                    console.log("editIdentityApi", res);
                    if (res.code === 200) {
                        ElMessage.success("创建成功");
                        router.push("/mediaIdentityManagement");

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
                editIdentityApi({
                    action: 1,//编辑修改
                    ...IdentityForm
                }).then((res) => {
                    if (res.code === 200) {
                        ElMessage.success("修改成功");
                        router.push("/mediaIdentityManagement");
                    }
                });
            } else {
                console.log("error", fields);
            }
        });
    }
};

onMounted(() => {
    if (IdentityStore.behavior === "modify") {
        // debugger
        IdentityForm = Object.assign(IdentityForm, IdentityStore.modifyIdentityInfo);
        if (IdentityForm.adsPage) {

            let flag = ['APP首屏', '网站首页', '频道二级页'].includes(IdentityForm.adsPage);
            if (flag) {
                IdentityForm.adsPageShow = IdentityForm.adsPage
            } else {
                IdentityForm.adsPageShow = '其它';
                IdentityForm.adsPageOther = IdentityForm.adsPage
            }
        }
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

:deep(.image-slot) {
    width: 100%;
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
}
</style>
    