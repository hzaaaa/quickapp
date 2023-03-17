<template>
    <div class="mediaHome">

        <!-- v-check="[handleAuthorization, ['media:kuaishou:add']]" -->

        <div class="">
            <el-button plain type="primary" @click='gotoEdit'>
                新增一个广告投放媒体
            </el-button>
        </div>
        <el-config-provider :locale="zhCn">
            <el-table :data="tableDataList" class="table"
                :header-cell-style="{ backgroundColor: '#f2f2f2', fontSize: '14px' }">
                <!-- height="600" -->
                <el-table-column label="序号" width="100" prop="remoteAdvertiserId"></el-table-column>
                <el-table-column label="媒体名称" prop="remoteAdvertiserName"></el-table-column>
                <el-table-column label="媒体标识" prop="company.companyName"></el-table-column>
                <el-table-column label="买量的量级" prop="company.companyName"></el-table-column>
                <el-table-column label="广告素材图片链接" prop="company.companyName"></el-table-column>
                <el-table-column label="广告落地页位置或地址" prop="company.companyName"></el-table-column>

                <el-table-column label="操作" width="200px">
                    <template #default>
                        <el-button link type="primary" @click="handleAuthorization" size="small">管理</el-button>
                        <el-button link type="primary" @click="handleAuthorization" size="small"
                            style="color: #d90000">删除</el-button>
                    </template>
                </el-table-column>


            </el-table>
        </el-config-provider>
        <el-pagination layout="prev, pager, next" :page-size="pageParams.pageSize" :total="pageParams.total"
            @current-change="handlePageChange" :hide-on-single-page="true">
        </el-pagination>
    </div>
</template>
    
<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { EditPen, Warning } from "@element-plus/icons-vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import {
    getAdvertiserListAddedApi,
    getCompanyListApi,
    getAuthUrlApi,
    postOpenMaterialSyncApi,
    postCloseAdvertiserApi,
} from "@/api/biz/material";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { getMaterialSidebarListApi } from "@/api/biz/material";


const route = useRoute();
const router = useRouter();

const appType = computed(() => {
    if (route.path.includes("toutiao")) return 1;
    if (route.path.includes("qianchuan")) return 2;
    if (route.path.includes("kuaishou")) return 3; // 应用类型，巨量引擎（头条）：1 巨量千川（千川）：2 磁力引擎（快手）：3 磁力金牛：4
    return -1;
});
const mediaCategory = computed(() => {
    if (route.path.includes("toutiao")) return 1;
    // if (route.path.includes("qianchuan")) return 2;
    if (route.path.includes("kuaishou")) return 4; // 1-头条; 2-百度; 3-广点通; 4-快手
    return -1;
});
onBeforeRouteLeave(() => {
    // console.log(route.path);
    companyList.value = [];
    searchForm.companyId = "";
});
// 切换侧边栏标签时会触发 watch 生命周期钩子
watch(
    () => route.name,
    (newVal, oldVal) => {
        // console.log(oldVal, "->", newVal, appType.value);
        if (appType.value !== -1) {
            let params = {
                pageNum: 1,
                pageSize: 50,
                appType: appType.value,
                // companyId: 8,
                // accountNameOrId: "",
            };
            getAdvertiserListAddedApi(params).then((res) => {
                tableDataList.value = res.data.list;
                pageParams.total = res.data.total;
            });
        }
    }
);

const searchForm = reactive({
    accountNameOrId: "",
    companyId: "",
});
const companyList = ref<any>([]);
getCompanyListApi({ mediaCategory: mediaCategory.value }).then((res) => {
    companyList.value = res.data.list;
});




/**
 * 账户首页表格区
 */
const tableDataList = ref<any>([]);
const curAdvertiser = ref(); // 点击同步素材时当前行
let params = {
    pageNum: 1,
    pageSize: 50,
    appType: appType.value,
    // companyId: 8,
    // accountNameOrId: "",
};
getAdvertiserListAddedApi(params).then((res) => {
    console.log("getAdvertiserListAddedApi", params);
    tableDataList.value = res.data.list;
    // debugger
    tableDataList.value = [{ remoteAdvertiserId: '1' }]
    tableDataList.value = [...tableDataList.value, ...tableDataList.value];
    tableDataList.value = [...tableDataList.value, ...tableDataList.value];
    tableDataList.value = [...tableDataList.value, ...tableDataList.value];
    tableDataList.value = [...tableDataList.value, ...tableDataList.value];
    tableDataList.value = [...tableDataList.value, ...tableDataList.value];

    //debugger
    pageParams.total = res.data.total;
});
tableDataList.value = [{ remoteAdvertiserId: '1' }]
tableDataList.value = [...tableDataList.value, ...tableDataList.value];
tableDataList.value = [...tableDataList.value, ...tableDataList.value];
tableDataList.value = [...tableDataList.value, ...tableDataList.value];
tableDataList.value = [...tableDataList.value, ...tableDataList.value];
tableDataList.value = [...tableDataList.value, ...tableDataList.value];
// 授权
const handleAuthorization = () => {
    getAuthUrlApi({ appType: appType.value }).then((res) => {
        window.open(res.data.oauthUrl);
    });
};



/**
 * 存储路径级联表单
 */
const pathDialogVisible = ref(false);
const pathDialogTitle = ref("");
const showPathDialogRemark = ref(false);
const cascaderPathOptions = ref<any>([]);
const cascaderPathArr = ref<number[]>([]); // 级联表单路径
const saveChangePath = () => {
    if (cascaderPathArr.value && cascaderPathArr.value.length) {
        pathDialogVisible.value = false;
        // console.log("curAdvertiser", curAdvertiser.value.advertiserId);
        // console.log("cascaderPathArr", cascaderPathArr.value[1]);
        let params = {
            advertiserId: curAdvertiser.value.advertiserId,
            projectId: cascaderPathArr.value[1],
        };
        postOpenMaterialSyncApi(params).then((res) => {
            console.log("postOpenMaterialSyncApi", res);
            ElMessage.success("同步素材储存路径选择成功");
            let params = <any>{
                pageNum: 1,
                pageSize: 50,
                appType: appType.value,
            };
            if (searchForm.accountNameOrId) params.accountNameOrId = searchForm.accountNameOrId;
            if (searchForm.companyId) params.companyId = searchForm.companyId;
            getAdvertiserListAddedApi(params).then((re) => {
                console.log("getAdvertiserListAddedApi", re);
                tableDataList.value = re.data.list;
                pageParams.total = re.data.total;
            });
        });
    } else {
        ElMessage.warning("未选择同步素材路径");
    }
};
const cancleChangePath = () => {
    pathDialogVisible.value = false;
    cascaderPathArr.value = [];
};

//跳转新增/编辑页
const gotoEdit = () => {
    router.push(`/mediaIdentityManagementEdit?type=add`);

}

/**
 * 分页相关
 */
const pageParams = reactive({
    pageNum: 1,
    pageSize: 50,
    total: 200,
});
const handlePageChange = (pageNum: number) => {
    console.log("handlePageChange", pageNum);
    let params = {
        pageNum: pageNum,
        pageSize: pageParams.pageSize,
        appType: appType.value,
        // companyId: 8,
        // accountNameOrId: "",
    };
    getAdvertiserListAddedApi(params).then((res) => {
        tableDataList.value = res.data.list;
        pageParams.total = res.data.total;
    });
};
</script>
    
<style scoped lang="scss">
// 页面整体布局
.mediaHome {
    font-size: 14px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

// 搜索区
.filter {
    &-label {
        margin-right: 8px;
    }

    &-input {
        margin-right: 12px;
        width: auto;
    }
}

// 表格区
.table {
    margin-top: 8px;
    border-radius: 4px 4px 0 0;
    font-size: 12px;
    height: 0;
    flex: 1;

    .materialSyncSwitch {
        display: flex;
        align-items: center;

        span {
            margin-right: 4px;
        }
    }
}

// 存储路径级联表单
.pathDialog {
    &-remark {
        margin-bottom: 8px;
    }

    &-title {
        display: flex;
        border: 1px solid var(--el-border-color);
        border-bottom: none;
        border-radius: 4px 4px 0 0;
        height: 36px;
        background-color: #f2f2f2;
        line-height: 36px;
        font-size: 16px;

        &-left {
            box-sizing: border-box;
            padding-left: 28px;
            border-right: 1px solid var(--el-border-color);
            width: 180px;
        }

        &-right {
            padding-left: 28px;
        }
    }
}

.el-row {
    align-items: center;
    height: 48px;
    // & :deep(.el-input__wrapper) {
    //   flex-grow: 0;
    // }
}
</style>
<style lang="scss">
.mediaPathDialog {
    .el-dialog__body {
        padding-top: 0;
    }
}
</style>
    