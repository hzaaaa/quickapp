<template>
  <div class="userHome">
    <el-container>
      <el-aside width="240px">
        <el-menu class="dept-menu" :default-openeds="[`${tempCompanyDeptId}`]" :default-active="route.query?.deptId">
          <template v-for="dept in deptTree" :key="dept.id">
            <!-- 项目列表不为空的使用 el-sub-menu -->
            <el-sub-menu :index="`${dept.id}`" v-if="dept.childrenList && dept.childrenList.length" class="dept-menu-sub">
              <template #title>
                <span>{{ dept.name }}</span>
              </template>
              <el-menu-item :index="`${subDept.id}`" @click="changeDept" class="aside-item"
                v-for="subDept in dept.childrenList" :key="subDept.id">
                <span>{{ subDept.name }}</span>
              </el-menu-item>
            </el-sub-menu>
            <!-- 项目列表为空的使用 el-menu-item -->
            <el-menu-item :index="`${dept.id}`" @click="changeDept" v-else>
              <span>{{ dept.name }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <el-row class="filter">
          <div class="filter-label">账户状态</div>
          <el-select v-model="searchForm.enabled" class="filter-input">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="停用" :value="0"></el-option>
          </el-select>
          <div class="filter-label">姓名</div>
          <el-input v-model="searchForm.userName" class="filter-input" clearable style="width: 200px"
            @keyup.enter="search"></el-input>
          <el-button type="primary" @click="search">查询</el-button>
        </el-row>
        <el-button plain type="primary" v-permission="['user:management:edit']" @click="jumpToAddUser">添加人员</el-button>
        <el-config-provider :locale="zhCn">
          <el-table :data="tableDataList" class="table"
            :header-cell-style="{ backgroundColor: '#f2f2f2', fontSize: '14px' }" height="600">
            <!-- <el-table-column label="人员ID" prop="userId"></el-table-column> -->
            <el-table-column label="用户账号" prop="userName"></el-table-column>
            <el-table-column label="姓名" prop="nickName"></el-table-column>
            <el-table-column label="角色">
              <template #default="scope">
                {{ scope.row.roleList.map((r: any) => r.roleName).join("、") }}
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template #default="scope">
                <div v-if="scope.row.roleList.map((r: any) => r.roleId).includes(tempAdminRoleId)">--</div>
                <el-switch v-model="scope.row.enabled" :active-value="1" :inactive-value="0"
                  @change="changeEnabled(scope.row)" size="small" v-else></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="所属部门" prop="deptName"> </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <div v-if="scope.row.roleList.map((r: any) => r.roleId).includes(tempAdminRoleId)">--</div>
                <template v-else>
                  <div class="" style="display:flex">
                    <div v-permission="['user:management:edit']" @click="jumpToModifyUser(scope.row)"
                      class="pointer primary-color">
                      <span>修改</span>
                    </div>
                    <div v-permission="['user:password:rest']" @click="resetPassword(scope.row)"
                      class="pointer primary-color" style="margin-left: 12px;">
                      <span>重置密码</span>
                    </div>
                  </div>

                </template>
              </template>
            </el-table-column>
            <!-- <el-table-column label="媒体账户">
                <template #default="scope">
                  <div v-if="scope.row.roleList.map((r: any) => r.roleId).includes(tempAdminRoleId)">--</div>
                  <template v-else>
                    <div class="table-button">
                      <span v-check="[() => jumpToAssignUser(scope.row), ['media:edit']]" class="pointer primary-color">
                        分配
                      </span>
                      <span @click="jumpToPeekUser(scope.row)" class="pointer primary-color">查看</span>
                    </div>
                  </template>
                </template>
              </el-table-column> -->
          </el-table>
        </el-config-provider>
      </el-main>
    </el-container>
  </div>
</template>
  
<script setup lang="ts">
import { getDeptTreeApi } from "@/api/system/dept";
import { postGetUserListByFormApi, postUpdateUserApi, passwordRestApi } from "@/api/system/user";
import { getRoleListApi2 } from "@/api/system/role";
import { useAccountStore } from "@/store/account";
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

const route = useRoute();
const router = useRouter();
const accountStore = useAccountStore();
/**
 * 部门树
 */
const deptTree = ref<any>([

]);
// v1 版本中没有根据用户id查得所有公司deptId的接口，临时写死id=8
let tempCompanyDeptId = 1;
let tempAdminRoleId = 10;
getDeptTreeApi({ id: tempCompanyDeptId }).then((res) => {
  deptTree.value = res.data;

});
//   let res ={"code":200,"data":[{"childrenList":[{"id":14,"name":"前端页面测试添加部门","path":"_8_","pid":8,"type":2},{"id":9,"name":"运营部","path":"_8_","pid":8,"sort":1,"type":2},{"id":11,"name":"新 CreativeDesk 测试组","path":"_8_","pid":8,"sort":1,"type":2},{"id":10,"name":"创意部","path":"_8_","pid":8,"sort":2,"type":2},{"id":12,"name":"CreativeDesk 测试组2","path":"_8_","pid":8,"sort":2,"type":2},{"id":17,"name":"行政部","path":"_8_","pid":8,"sort":3,"type":2},{"id":13,"name":"测试修改部门2","path":"_8_","pid":8,"sort":65,"type":2}],"createBy":"Admin","createTime":"2023-01-12 15:32:02","id":8,"name":"北京微言联动科技有限公司","pid":0,"type":1,"updateBy":"Admin","updateTime":"2023-01-12 15:32:03"}],"msg":"success"}
//   deptTree.value = res.data;
//   getRoleListApi2().then(res=>{
//     deptTree.value = res.data;
//   })
//   debugger
// 如果路由的 query 中有 deptId，则取 deptId 部门下的人员列表，否则取全公司下的人员列表
postGetUserListByFormApi({ deptId: route.query?.deptId ?? tempCompanyDeptId }).then((res) => {
  tableDataList.value = res.data;
  // tableDataList.value = res.data.filter((u: any) => u.roleList.find((r: any) => r.roleId === tempAdminRoleId));
});

const changeDept = (dept: any) => {

  console.log("deptId", dept.index);
  postGetUserListByFormApi({ deptId: dept.index }).then((res) => {
    console.log("res", res.data);
    tableDataList.value = res.data;
    searchForm.deptId = dept.index;
    searchForm.enabled = '';
    searchForm.userName = "";
  });
  // router.replace({ path: route.path, query: { deptId: dept.index } });
  router.replace(`${route.path}?deptId=${dept.index}`);
};

/**
 * 搜索区
 */
const searchForm = reactive({
  deptId: tempCompanyDeptId,
  enabled: <number | ''>'',
  userName: "",
});
const search = () => {
  console.log("search", searchForm);
  postGetUserListByFormApi(searchForm).then((res) => {
    tableDataList.value = res.data;
  });
};
const jumpToAddUser = () => {
  console.log("jumpToAddUser");
  router.push("/userAndRoleEdit");
  accountStore.setBehavior("add");
};

/**
 * 人员表格
 */
const tableDataList = ref<any[]>([]);

const jumpToModifyUser = (row: any) => {
  console.log("jumpToModifyUser", row);
  // router.push("/account/user_modify");
  router.push("/userAndRoleEdit");
  accountStore.setBehavior("modify");
  accountStore.setUserInfo(row);
};
const jumpToAssignUser = (row: any) => {
  console.log("jumpToAssignUser", row);
  router.push("/account/user_assign");
  accountStore.setUserInfo(row);
};
const jumpToPeekUser = (row: any) => {
  console.log("jumpToAssignUser", row);
  router.push("/account/user_peek");
  accountStore.setUserInfo(row);
};
const changeEnabled = (row: any) => {
  // @change="(checked: boolean) => changeEnabled(checked, scope.row)"
  console.log("changeEnabled", row);
  ElMessageBox.confirm(`此操作将${row.enabled === 0 ? "禁用" : "激活"} ${row.nickName}，是否继续？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // console.log("changeEnabled", row);
      let params = {
        userId: row.userId,
        enabled: row.enabled,
        nickName: row.nickName,
        email: row.email,
        deptId: row.deptId,
        roleIdList: row.roleList.map((r: any) => r.roleId),
      };
      // console.log("params", params);
      postUpdateUserApi(params).then((res) => {
        console.log("postUpdateUserApi", res);
      });
    })
    .catch(() => {
      if (row.enabled === 0) {
        row.enabled = 1;
      } else {
        row.enabled = 0;
      }
    });
};
const resetPassword = (row: any) => {

  console.log("resetPassword", row);
  ElMessageBox.confirm(`此操作将会把 ${row.nickName}的密码重置为123456，是否继续？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {

      let params = {


        id: row.userId
      };
      // console.log("params", params);
      passwordRestApi(params).then((res) => {
        console.log("postUpdateUserApi", res);
        if (res.msg === 'success') {
          ElMessage.success('重置密码成功');
        } else {
          ElMessage.error(res.msg);
        }
      });
    })
    .catch(() => {
      console.log('重置取消');
    });
};
</script>
  
<style scoped lang="scss">
.userHome {
  height: 100%;
  font-size: 14px;

  .el-container {
    height: 100%;

    .el-aside {
      border-right: 1px solid #f2f2f2;
    }
  }
}

.dept-menu {
  :deep(span) {
    font-size: 10px;
  }
}

.filter {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  &-label {
    margin-right: 8px;
  }

  &-input {
    margin-right: 12px;
    width: auto;
  }
}

.table {
  margin-top: 8px;
  border-radius: 4px 4px 0 0;
  font-size: 12px;

  &-button {
    span {
      margin-right: 8px;
    }
  }
}
</style>
  