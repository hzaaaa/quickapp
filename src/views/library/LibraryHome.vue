<template>
  <div class="library">
    <!-- 左侧项目列表 -->
    <aside class="aside">
      <el-button type="primary" class="aside-button" @click="showProjectDialog('create')">创建</el-button>
      <el-input class="aside-input" :prefix-icon="Search" placeholder="输入项目名称搜索" v-model="searchProject"></el-input>
      <el-menu @open="handleOpen" @close="handleClose">
        <el-sub-menu index="1">
          <template #title>
            <el-icon><Menu /></el-icon>
            <span>教育培训</span>
          </template>
          <el-menu-item index="1-1" @click="test" class="aside-item">
            <span>军队文职</span>
            <el-popover :show-arrow="false" placement="bottom-start" ref="popoverRef">
              <template #reference>
                <el-icon :size="12" class="aside-more" @click.stop="test2"><MoreFilled /></el-icon>
              </template>
              <div @click="showProjectDialog('modify')" class="popover-modify">修改</div>
            </el-popover>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><Menu /></el-icon>
            <span>书籍应用</span>
          </template>
          <el-menu-item index="2-1">懒懒听书</el-menu-item>
          <el-menu-item index="2-2">书路阅读</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </aside>

    <!-- 右侧核心内容 -->
    <div class="content">
      <el-row>
        <el-col><div class="content-title">军队文职</div></el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-button-group>
            <el-button :type="platform === 'toutiao' ? 'primary' : ''" plain @click="changeToToutiao">头条</el-button>
            <el-button :type="platform === 'kuaishou' ? 'primary' : ''" plain @click="changeToKuaishou">快手</el-button>
          </el-button-group>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="content-label">创建时间</div>
          <el-config-provider :locale="zhCn">
            <el-date-picker v-model="daterange" type="daterange" range-separator="至" class="content-datepicker" />
          </el-config-provider>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="content-label">来源账号</div>
          <el-select v-model="sourceAccount" class="content-account">
            <el-option label="来源一" value="origin1"></el-option>
            <el-option label="来源二" value="origin2"></el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <div class="content-label">素材名称/ID</div>
          <el-input v-model="materialName" class="content-id" clearable></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="content-label">人员</div>
          <el-select v-model="searchRole" class="content-role">
            <el-option label="后期" value="houqi"></el-option>
            <el-option label="剪辑" value="jianji"></el-option>
          </el-select>
          <el-select v-model="searchPerson" class="content-person">
            <el-option label="李四" value="lisi"></el-option>
            <el-option label="王五" value="wangwu"></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <div class="content-label">素材类型</div>
          <el-select v-model="materialType" class="content-type">
            <el-option label="图片" value="pic"></el-option>
            <el-option label="视频" value="video"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2"><el-button link type="primary" class="content-button">清空</el-button></el-col>
        <el-col :span="2"><el-button type="primary" class="content-button" @click="search">查询</el-button></el-col>
      </el-row>
      <el-row>
        <el-select v-model="batch" placeholder="批量操作" :disabled="!selectedList.length">
          <el-option label="分配制作人" value="assign"></el-option>
        </el-select>
      </el-row>

      <!-- 素材表格 -->
      <el-table
        :data="tempTable"
        @selection-change="handleSelectionChange"
        :header-cell-style="{ backgroundColor: '#f2f2f2', fontSize: '14px' }"
        class="table"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="素材" width="300">
          <template #default="scope">
            <div class="table-material">
              <div class="table-material-left"></div>
              <div class="table-material-right">
                <div>{{ scope.row.name }}</div>
                <div v-if="scope.row.time">时长：{{ scope.row.time }}</div>
                <div v-if="scope.row.size">大小：{{ scope.row.size }}</div>
                <div>ID：{{ scope.row.id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作"><div class="table-button">详情</div></el-table-column>
        <el-table-column prop="creatTime" label="创建时间"></el-table-column>
        <el-table-column label="创建人">
          <template #default="scope">
            <div v-if="scope.row.creator">{{ scope.row.creator }}</div>
            <div v-else><span class="table-button">分配</span></div>
          </template>
        </el-table-column>
        <el-table-column label="参与制作人">
          <template #default="scope">
            <div v-if="scope.row.director">编导：{{ scope.row.director }}</div>
            <div v-else>编导：<span class="table-button" @click="assign('director')">分配</span></div>
            <div v-if="scope.row.cameraMan">摄像：{{ scope.row.cameraMan }}</div>
            <div v-else>摄像：<span class="table-button" @click="assign('cameraMan')">分配</span></div>
            <div v-if="scope.row.editor">剪辑：{{ scope.row.editor }}</div>
            <div v-else>剪辑：<span class="table-button" @click="assign('editor')">分配</span></div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 创建、修改项目弹窗 -->
    <el-dialog v-model="projectDialogVisible" :title="projectDialogTitle" width="60%">
      <el-form :model="projectForm" label-width="100px" label-position="left">
        <el-form-item label="项目名称">
          <el-input v-model="projectForm.name" maxlength="20" :show-word-limit="true" />
        </el-form-item>
        <el-form-item label="所属行业">
          <el-select v-model="projectForm.profession">
            <el-option label="行业1" value="hangye1"></el-option>
            <el-option label="行业2" value="hangye2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="协作者">
          <el-radio-group v-model="projectForm.teamworkerType" class="radio-group">
            <el-radio label="all">所有人</el-radio>
            <el-radio label="appoint">指定协作人</el-radio>
          </el-radio-group>
          <el-select v-model="projectForm.teamworker" multiple collapse-tags style="width: 100%">
            <el-option v-for="item in teamworkerOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注（选填）">
          <el-input v-model="projectForm.notes" type="textarea" :autosize="{ minRows: 3, maxRows: 5 }"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="projectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="projectDialogVisible = false">确定</el-button>
      </template>
    </el-dialog>

    <!-- 选择协作者弹窗 -->
    <el-dialog v-model="teamworkerDialogVisible" title="选择协作者" width="700px">
      <div class="teamworker">
        <div class="teamworker-all">
          <div class="teamworker-all-title">人员</div>
          <div class="teamworker-all-content">
            <div class="teamworker-all-content-left">
              <el-menu>
                <el-sub-menu index="1">
                  <template #title>北京微言联动科技有限公司</template>
                  <el-menu-item index="1-1" @click="chooseDept1">运营部</el-menu-item>
                  <el-menu-item index="1-2" @click="chooseDept2">创意部</el-menu-item>
                </el-sub-menu>
              </el-menu>
            </div>
            <div class="teamworker-all-content-right">
              <el-scrollbar>
                <el-checkbox
                  v-model="teamworkerCheckAll"
                  :indeterminate="isIndeterminate"
                  @change="handleTeamworkerCheckAllChange"
                  >全部</el-checkbox
                >
                <el-checkbox-group v-model="teamworkerChecked" @change="handleTeamworkerGroupChange" class="checkbox-group">
                  <el-checkbox
                    v-for="teamworker in optionalTeamworkers"
                    :key="teamworker.id"
                    :label="teamworker"
                    @change="handleTeamworkerSingleChange"
                  >
                    {{ teamworker.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-scrollbar>
            </div>
          </div>
        </div>
        <div class="teamworker-chosen">
          <div class="teamworker-chosen-title">已选0</div>
          <div class="teamworker-chosen-content">666</div>
        </div>
      </div>
      <template #footer>
        <el-button @click="teamworkerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="teamworkerDialogVisible = false">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { Search, Menu, MoreFilled } from "@element-plus/icons-vue";
import { PopoverInstance } from "element-plus";

/**
 * 左侧项目列表
 */
const searchProject = ref(""); // 左侧项目列表，项目搜索框文字
const popoverRef = ref<PopoverInstance>();
const test = (a: any) => {
  console.log("a", a);
};
const test2 = (a: any) => {
  console.log("a2", a);
};
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const popoverClose = () => {
  popoverRef.value?.hide();
};

/**
 * 右侧核心内容
 */
const platform = ref("toutiao"); // 平台：头条/快手
const daterange = ref(""); // 创建时间：时间范围
const sourceAccount = ref(""); // 来源账号
const materialName = ref(""); // 素材名称/id
const searchRole = ref(""); // 角色
const searchPerson = ref(""); // 人员
const materialType = ref(""); // 素材类型：图片/视频

const changeToToutiao = () => {
  platform.value = "toutiao";
};
const changeToKuaishou = () => {
  platform.value = "kuaishou";
};
const search = () => {
  teamworkerDialogVisible.value = true;
};

/**
 * 素材表格
 */
const batch = ref(""); // 批量操作：分配制作人
const selectedList = ref([]); // 批量选择的素材列表
const tempTable = ref([
  {
    material: "www.abc.video",
    name: "video1",
    time: "00:50",
    id: "1234456",
    creatTime: "2022-12-14 15:44:50",
    creator: null,
    director: "张三",
    cameraMan: "李四",
    editor: null,
  },
  {
    material: "www.123.png",
    name: "华图",
    size: "3M",
    id: "12348883",
    creatTime: "2022-12-13 15:44:59",
    creator: "王五",
    director: null,
    cameraMan: "李四",
    editor: "三三",
  },
]);

const handleSelectionChange = (val: any) => {
  // console.log("selection change", val);
  selectedList.value = val;
};
const assign = (role: string) => {
  console.log("assign", role);
};

/**
 * 创建、修改项目弹窗
 */
const projectDialogVisible = ref(false);
const projectDialogTitle = ref("");
const projectForm = reactive({
  name: "", // 项目名称
  profession: "", // 所属行业
  teamworkerType: "appoint", // 协作者类型：所有人all / 指定协作人appoint
  teamworker: [], // 协作者
  notes: "", // 备注
});
const teamworkerOptions = [
  { value: "1", label: "张一" },
  { value: "2", label: "张二" },
  { value: "3", label: "张三" },
  { value: "4", label: "李四" },
  { value: "5", label: "王五" },
];

const showProjectDialog = (from: string) => {
  if (from === "create") {
    projectDialogVisible.value = true;
    projectDialogTitle.value = "创建项目";
  }
  if (from === "modify") {
    popoverClose();
    projectDialogVisible.value = true;
    projectDialogTitle.value = "修改项目";
  }
};

/**
 * 选择协作者弹窗
 */
interface teamworker {
  id: number;
  name: string;
}

const teamworkerDialogVisible = ref(false);
const teamworkerCheckAll = ref(false);
const isIndeterminate = ref(false);
const teamworkerChecked = ref<teamworker[]>();
const optionalTeamworkers = ref<teamworker[]>([
  { id: 1, name: "张一" },
  { id: 2, name: "张二" },
  { id: 3, name: "张三" },
  { id: 4, name: "李四" },
  { id: 5, name: "王五" },
  { id: 4, name: "李四" },
  { id: 5, name: "王五" },
]);
// const teamworkerRes = ref<teamworker[]>(); // 已选协作者，可能包含不同部门的

// 点击协作者弹窗，全部协作者
const handleTeamworkerCheckAllChange = (allCheck: boolean) => {
  console.log("allcheck", allCheck);
  console.log("before", teamworkerChecked.value);

  teamworkerChecked.value = allCheck ? optionalTeamworkers.value : [];
  console.log("after", teamworkerChecked.value);
  isIndeterminate.value = false;
};
// 点击协作者弹窗，整个协作者组
const handleTeamworkerGroupChange = (teamworkers: teamworker[]) => {
  console.log("teamgroup", teamworkers);

  const checkedCount = teamworkers.length;
  teamworkerCheckAll.value = checkedCount === optionalTeamworkers.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < optionalTeamworkers.value.length;
};
// 点击协作者弹窗，单个协作者
const handleTeamworkerSingleChange = (teamworker: teamworker) => {
  console.log("single", teamworker);
};
// 点击协作者弹窗，部门1
const chooseDept1 = () => {
  optionalTeamworkers.value = [
    { id: 1, name: "张一" },
    { id: 2, name: "张二" },
    { id: 3, name: "张三" },
    { id: 4, name: "李四" },
    { id: 5, name: "王五" },
    { id: 4, name: "李四" },
    { id: 5, name: "王五" },
  ];
};
// 点击协作者弹窗，部门2
const chooseDept2 = () => {
  optionalTeamworkers.value = [
    { id: 8, name: "徐八" },
    { id: 9, name: "徐九" },
    { id: 10, name: "徐十" },
  ];
};
</script>

<style scoped lang="scss">
.library {
  display: flex;
  height: 100%;
  // 左侧项目列表
  .aside {
    flex-shrink: 0;
    box-sizing: border-box;
    padding: 20px 12px 0;
    border-right: 4px #f2f2f2 solid;
    width: 200px;
    &-button {
      margin-bottom: 20px;
      width: 100%;
      height: 38px;
    }
    &-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &-more {
      height: 20px;
      color: #666666;
      transform: translateX(10px) rotate(90deg);
    }
  }

  // 右侧核心内容
  .content {
    flex: 1;
    padding: 20px 20px 0;
    &-title {
      font-weight: 700;
    }
    &-label {
      margin-right: 8px;
    }
    &-account,
    &-id,
    &-role,
    &-person,
    &-type {
      flex: 1;
    }
    &-role {
      margin-right: 4px;
    }
    &-button {
      width: 100%;
    }
  }
}

// 素材表格
.table {
  font-size: 12px;
  &-button {
    cursor: pointer;
    color: var(--el-color-primary);
  }
  &-material {
    display: flex;
    align-items: center;
    &-left {
      margin-right: 8px;
      width: 160px;
      height: 90px;
      background-color: #f2f2f2;
    }
  }
}

// 创建、修改项目弹窗
.radio-group {
  display: flex;
  flex-direction: column;
  label {
    margin-bottom: 4px;
  }
}

// 选择协作者弹窗
.teamworker {
  display: flex;
  &-all {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    box-sizing: border-box;
    margin-right: 20px;
    border: 1px solid #cccccc;
    border-radius: 2px;
    width: 400px;
    height: 320px;
    &-title {
      box-sizing: border-box;
      padding-left: 16px;
      border-bottom: 1px solid #eeeeee;
      line-height: 40px;
      font-size: 16px;
    }
    &-content {
      display: flex;
      overflow: hidden;
      flex: 1;
      &-left {
        flex: 1;
        border-right: 1px solid #eeeeee;
      }
      &-right {
        flex-shrink: 0;
        box-sizing: border-box;
        padding: 12px 0 0 12px;
        width: 160px;
      }
    }
  }
  &-chosen {
    flex-shrink: 0;
    box-sizing: border-box;
    border: 1px solid #cccccc;
    border-radius: 2px;
    width: 200px;
    &-title {
      display: flex;
      box-sizing: border-box;
      padding-left: 16px;
      border-bottom: 1px solid #eeeeee;
      line-height: 40px;
      font-size: 16px;
    }
    // &-content {
    // }
  }
  .checkbox-group {
    display: flex;
    flex-direction: column;
  }
}
.el-row {
  align-items: center;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.popover-modify {
  height: 30px;
  cursor: pointer;
  line-height: 30px;
  &:hover {
    background-color: var(--el-menu-hover-bg-color);
  }
}
</style>
