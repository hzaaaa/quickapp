<template>
    <div class="mediaHome">



        <div class="head-row">
            <el-button plain type="primary" @click='gotoAdd' v-permission="['identity:edit']">
                新增一个广告投放媒体
            </el-button>
            <div class="filter-label">选择媒体标识状态</div>
            <div class="" style="margin-right:12px">

                <el-select v-model="searchForm.enabled" class="filter-input">
                    <el-option v-for="item in enabledOption" :label="item.label" :value="item.value"></el-option>

                </el-select>
            </div>
            <el-button type="primary" v-throttle="() => resetPageToOne()">查询</el-button>
        </div>
        <el-config-provider :locale="zhCn">
            <el-table :data="tableDataList" class="table"
                :header-cell-style="{ backgroundColor: '#f2f2f2', fontSize: '14px' }">
                <!-- height="600" -->
                <el-table-column label="序号" sortable width="100" prop="identityId"></el-table-column>
                <el-table-column label="媒体名称" prop="mediaName"></el-table-column>
                <el-table-column label="媒体标识" prop="mediaIdentity"></el-table-column>
                <el-table-column label="买量的量级" sortable prop="purchasingQuantity">
                    <template #default="scope">
                        {{ scope.row.purchasingQuantity }} PV/天
                    </template>
                </el-table-column>
                <el-table-column label="广告素材图片链接" prop="adsLink">
                    <template #default="scope">
                        <el-popover effect="light" trigger="hover" placement="top" width="auto">
                            <template #default>
                                <el-image style="width: 300px; height: 200px" fit="contain" alt="暂无图片"
                                    :src="scope.row.adsLink">
                                    <template #error>
                                        <div class="image-slot">
                                            <el-icon><icon-picture /></el-icon>
                                        </div>
                                    </template>
                                </el-image>
                            </template>
                            <template #reference>
                                <div style="cusor:pointer">{{ scope.row.adsLink }} </div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="广告落地页位置或地址" prop="adsPage"></el-table-column>
                <el-table-column label="当前状态" width="180px" sortable prop="enabled">
                    <template #default="scope">
                        <div v-if="scope.row.enabled === 1" style="color: #0a9714">可用</div>
                        <div v-else-if="scope.row.enabled === 0" style="color: #d90000">停用</div>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="200px">
                    <template #default="scope">
                        <el-button link type="primary" @click="gotoEdit(scope.row)" size="small"
                            v-permission="['identity:edit']">管理</el-button>
                        <!-- <el-button link type="primary" @click="removeIdentity(scope.row)" size="small"
                            style="color: #d90000">删除</el-button> -->
                    </template>
                </el-table-column>


            </el-table>
        </el-config-provider>
        <el-pagination layout="prev, pager, next" :current-page="pageParams.pageNum" :page-size="pageParams.pageSize"
            :total="pageParams.total" @current-change="handlePageChange" :hide-on-single-page="true">
        </el-pagination>
    </div>
</template>
    
<script setup lang="ts">
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { ref, reactive, computed, watch } from "vue";
import { EditPen, Warning } from "@element-plus/icons-vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import {
    getIdentityListApi,
    getIdentityDetailsApi,
    deleteIdentityApi,

} from "@/api/biz/identity";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { useIdentityStore } from "@/store/identity";
import useListPageHook from '@/hook/listPage'


const route = useRoute();
const router = useRouter();
const IdentityStore = useIdentityStore();

/* 查询区 */
const searchForm = reactive({
    enabled: <number | ''>'',//是否启用. 0-未启用; 1-已启用

})

let {
    pageParams,
    tableDataList,
    handlePageChange,
    resetPageToOne
} = useListPageHook(getIdentityListApi, () => { return searchForm });




const enabledOption = reactive([
    {
        label: '全部',
        value: '',
    },
    {
        label: '可用',
        value: 1,
    },
    {
        label: '停用',
        value: 0,
    },
])




//跳转新增/编辑页

const gotoAdd = () => {
    IdentityStore.setBehavior("add");
    router.push(`/mediaIdentityManagementEdit`);
}
const gotoEdit = (row: any) => {
    IdentityStore.setBehavior("modify");
    getIdentityDetailsApi({
        identityId: row.identityId
    }).then(res => {
        console.log('res', res)
        IdentityStore.setIdentityInfo(row);
        router.push(`/mediaIdentityManagementEdit`);
    })


}
const removeIdentity = (row: any) => {

    console.log("removeIdentity", row);
    ElMessageBox.confirm(`此操作将删除${row.mediaName}的媒体，是否继续？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {

            let params = {
                "action": 1,
                identityId: row.identityId
            };
            // console.log("params", params);
            deleteIdentityApi(params).then((res) => {
                console.log("postUpdateUserApi", res);
                if (res.msg === 'success') {
                    ElMessage.success('删除媒体成功');
                    resetPageToOne();
                } else {
                    ElMessage.error(res.msg);
                }
            });
        })
        .catch(() => {
            console.log('删除取消');
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

    .head-row {
        display: flex;
        align-items: center;

        .filter-label {
            margin-left: 30px;
            flex: 1;
            text-align: right;
        }
    }
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
<style lang="scss">
.mediaPathDialog {
    .el-dialog__body {
        padding-top: 0;
    }
}

.cell {
    cursor: pointer;
}
</style>
    