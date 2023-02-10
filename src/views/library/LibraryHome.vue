<template>
  <div class="library">
    <!-- 左侧项目列表 -->
    <aside class="aside" :class="{ narrow: isCollapse }">
      <template v-if="!isCollapse">
        <el-button type="primary" class="aside-button" @click="testApi">创建</el-button>
        <!-- <el-button type="primary" class="aside-button" @click="showProjectDialog('create')">创建</el-button> -->
        <el-input class="aside-input" :prefix-icon="Search" placeholder="输入项目名称搜索" v-model="searchProject"></el-input>
        <el-row class="aside-menu">
          <el-scrollbar>
            <el-menu @open="handleOpen" @close="handleClose">
              <template v-for="indus in sidebarList" :key="indus.indusId">
                <!-- 项目列表不为空的使用 el-sub-menu -->
                <el-sub-menu :index="`${indus.indusId}`" v-if="indus.projectList && indus.projectList.length">
                  <template #title>
                    <el-icon><Menu /></el-icon>
                    <span>{{ indus.indusName }}</span>
                  </template>
                  <el-menu-item
                    :index="`${indus.indusId}-${project.projectId}`"
                    @click="test"
                    class="aside-item"
                    v-for="project in indus.projectList"
                    :key="project.projectId"
                  >
                    <el-tooltip :content="project.projectName" placement="right">
                      <span>{{ project.projectName }}</span>
                    </el-tooltip>
                    <el-popover :show-arrow="false" placement="bottom-start" ref="popoverRef">
                      <template #reference>
                        <el-icon :size="12" class="aside-more" @click.stop="test2"><MoreFilled /></el-icon>
                      </template>
                      <div @click="showProjectDialog('modify')" class="popover-modify">修改</div>
                    </el-popover>
                  </el-menu-item>
                </el-sub-menu>
                <!-- 项目列表为空的使用 el-menu-item -->
                <el-menu-item :index="`${indus.indusId}`" @click="showNoProjectPage = true" v-else>
                  <el-icon><Menu /></el-icon>
                  <span>{{ indus.indusName }}</span>
                </el-menu-item>
              </template>
            </el-menu>
          </el-scrollbar>
        </el-row>
      </template>
      <el-row class="aside-collapse">
        <el-icon v-if="isCollapse" @click="expandSidebar" size="large" class="pointer"><Expand /></el-icon>
        <el-icon v-else @click="foldSidebar" size="large" class="pointer"><Fold /></el-icon>
      </el-row>
    </aside>

    <!-- 右侧核心内容 -->
    <div class="content flx-center" v-if="showNoProjectPage">
      <div>
        <div class="content-noproject">暂无项目</div>
        <el-button @click="showProjectDialog('create')" type="primary" size="large">创建项目</el-button>
      </div>
    </div>
    <div class="content" v-else>
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
        <el-col :span="2"><el-button link type="primary" class="content-button" @click="clearQuery">清空</el-button></el-col>
        <el-col :span="2"><el-button type="primary" class="content-button" @click="search">查询</el-button></el-col>
      </el-row>
      <el-row>
        <el-select v-model="batchLabel" placeholder="批量操作" :disabled="!selectedList.length">
          <el-option label="分配制作人" value="assign" @click="showAssignDialog('batch')"></el-option>
        </el-select>
      </el-row>

      <!-- 素材表格 -->
      <div v-if="showNoMaterialText" class="content-nomaterial">暂无数据</div>
      <el-table
        :data="tempTable"
        @selection-change="handleSelectionChange"
        :header-cell-style="{ backgroundColor: '#f2f2f2', fontSize: '14px' }"
        class="table"
        v-else
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="素材" width="300">
          <template #default="scope">
            <div class="table-material">
              <div class="table-material-left" @click="openDrawer(scope.row)">
                <div class="table-material-left-box" v-if="scope.row.size">
                  <img :src="getImage(scope.row.material)" alt="" />
                </div>
                <div class="table-material-left-box" v-else>
                  <video :src="getVideo(scope.row.material)"></video>
                  <el-icon class="icon" :size="40"><VideoPlay /></el-icon>
                </div>
              </div>
              <div class="table-material-right">
                <div>{{ scope.row.name }}</div>
                <div v-if="scope.row.time">时长：{{ scope.row.time }}</div>
                <div v-if="scope.row.size">大小：{{ scope.row.size }}</div>
                <div>ID：{{ scope.row.id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <div class="table-button" @click="openDrawer(scope.row)">详情</div>
          </template>
        </el-table-column>
        <el-table-column prop="creatTime" label="创建时间"></el-table-column>
        <el-table-column label="创建人">
          <template #default="scope">
            <div v-if="scope.row.creator">{{ scope.row.creator }}</div>
            <div v-else><span class="table-button" @click="showAssignDialog('creator')">分配</span></div>
          </template>
        </el-table-column>
        <el-table-column label="参与制作人">
          <template #default="scope">
            <div v-if="scope.row.director">编导：{{ scope.row.director }}</div>
            <div v-else>编导：<span class="table-button" @click="showAssignDialog('director')">分配</span></div>
            <div v-if="scope.row.cameraMan">摄像：{{ scope.row.cameraMan }}</div>
            <div v-else>摄像：<span class="table-button" @click="showAssignDialog('cameraMan')">分配</span></div>
            <div v-if="scope.row.editor">剪辑：{{ scope.row.editor }}</div>
            <div v-else>剪辑：<span class="table-button" @click="showAssignDialog('editor')">分配</span></div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 素材列表分配角色弹窗 -->
    <el-dialog v-model="assignDialogVisible" :title="assignDialogTitle" @closed="handleCloseAssignDialog">
      <el-form :model="roleForm" label-width="60px" v-if="curAssignRole === 'batch'">
        <el-form-item :label="roleEnum[key]" v-for="(value, key) in roleForm" :key="key">
          <el-select v-model="roleForm[key]">
            <el-option v-for="p in mockTeamworkers" :key="p.id" :label="p.name" :value="p.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-select v-model="tempAssignPersonId" placeholder="请选择" v-else>
        <el-option v-for="p in mockTeamworkers" :key="p.id" :label="p.name" :value="p.id"></el-option>
      </el-select>
      <template #footer>
        <el-button @click="cancleAssign">取消</el-button>
        <el-button type="primary" @click="assign">确定</el-button>
      </template>
    </el-dialog>

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
          <el-select
            ref="appointSelectRef"
            v-model="projectForm.teamworker"
            multiple
            style="width: 100%"
            :disabled="appointDisabled"
            @click="test3"
            @remove-tag="removeTag"
          >
            <el-option v-for="item in allDeptTeamworkerChecked" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注（选填）">
          <el-input v-model="projectForm.notes" type="textarea" :autosize="{ minRows: 3, maxRows: 5 }"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancleProjectForm">取消</el-button>
        <el-button type="primary" @click="submitProjectForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 选择协作者弹窗 -->
    <el-dialog v-model="teamworkerDialogVisible" title="选择协作者" width="700px">
      <div class="teamworker">
        <div class="teamworker-all">
          <div class="teamworker-all-title" @click="print">人员</div>
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
                    @change="(checked: boolean) => handleTeamworkerSingleChange(checked, teamworker)"
                  >
                    {{ teamworker.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-scrollbar>
            </div>
          </div>
        </div>
        <div class="teamworker-chosen">
          <div class="teamworker-chosen-title">已选 {{ allDeptTeamworkerChecked?.length ?? 0 }}</div>
          <div class="teamworker-chosen-content">
            <div class="row" v-for="worker in allDeptTeamworkerChecked" :key="worker.id">
              <div @click="deleteChoosenTeamworker(worker.id)">{{ worker.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="cancleTeamworkerChecked">取消</el-button>
        <el-button type="primary" @click="saveTeamworkerChecked">确定</el-button>
      </template>
    </el-dialog>

    <!-- 图片、视频详情抽屉 -->
    <el-drawer v-model="drawerOpen" direction="rtl" :show-close="false" size="40%" class="detail">
      <template #header>
        <div class="detail-header">
          <span class="detail-header-prefix">文件名：</span>
          <span v-if="showTitleInput" class="detail-header-input flx-center">
            <el-input v-model="tempTitle"></el-input>
            <el-button type="primary" @click="saveEditTitle" class="button">保存</el-button>
            <el-button @click="cancelEditTitle">取消</el-button>
          </span>
          <span v-else>{{ originTitle }}</span>
        </div>
        <el-icon :size="20" @click="editTitle" class="pointer" v-if="!showTitleInput"><EditPen /></el-icon>
      </template>
      <template #default>
        <div class="detail-content">
          <div class="detail-content-preview" v-if="drawerContent.size">
            <el-image
              :src="getImage(drawerContent.material)"
              :preview-src-list="[getImage(drawerContent.material)]"
              fit="contain"
            ></el-image>
          </div>
          <div class="detail-content-preview" v-else>
            <video :src="getVideo(drawerContent.material)" controls></video>
          </div>
          <div class="detail-content-material">
            <div class="detail-content-title">素材信息</div>
            <div class="detail-content-info">
              <div class="info-row"><span class="subtitle">素材ID</span>10086101010</div>
              <div class="info-row">
                <span class="subtitle">储存路径</span>
                <span @click="openPathDialog" class="flx-align-center pointer">
                  <span>{{ originalPathStr }}</span>
                  <el-icon style="margin-left: 4px"><EditPen /></el-icon>
                </span>
              </div>
              <div class="info-row"><span class="subtitle">创建时间</span>2022-12-16 10:13:33</div>
              <div class="info-row"><span class="subtitle">素材尺寸</span>125*125</div>
              <div class="info-row"><span class="subtitle">图片格式</span>png</div>
              <div class="info-row"><span class="subtitle">素材大小</span>1.17k</div>
            </div>
          </div>
          <div class="detail-content-teamworker">
            <div class="detail-content-title">人员信息</div>
            <div class="detail-content-info">
              <div class="info-row"><span class="subtitle">创建人</span>张三</div>
              <div class="info-row">
                <span class="subtitle">编导</span>
                <span v-if="showPersonSelect" class="detail-content-info-input">
                  <el-select v-model="tempPersonId" size="small">
                    <el-option v-for="p in optionalPersons" :key="p.id" :label="p.name" :value="p.id"></el-option>
                  </el-select>
                  <el-button type="primary" @click="saveSelectPerson" class="button" size="small">保存</el-button>
                  <el-button @click="cancleSelectPerson" size="small">取消</el-button>
                </span>
                <span @click="selectPerson" v-else class="flx-align-center pointer">
                  <span>{{ originPerson?.name }}</span>
                  <el-icon style="margin-left: 4px"><EditPen /></el-icon>
                </span>
              </div>
              <div class="info-row"><span class="subtitle">摄像</span>里斯</div>
              <div class="info-row"><span class="subtitle">剪辑</span>分配</div>
            </div>
          </div>
        </div>
      </template>
    </el-drawer>

    <!-- 存储路径级联表单 -->
    <el-dialog v-model="pathDialogVisible" :show-close="false" class="pathDialog">
      <div class="pathDialog-title">
        <div class="pathDialog-title-left">行业分类</div>
        <div class="pathDialog-title-right">项目名称</div>
      </div>
      <el-cascader-panel :options="pathOptions" @change="handlePathChange" v-model="tempPathArr"></el-cascader-panel>
      <template #footer>
        <el-button @click="cancleChangePath">取消</el-button>
        <el-button type="primary" @click="saveChangePath">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { Search, Menu, MoreFilled, VideoPlay, EditPen, Expand, Fold } from "@element-plus/icons-vue";
import { PopoverInstance } from "element-plus";
import { getUserListApi } from "@/api/system/user";
import { getMaterialSidebarListApi } from "@/api/biz/material";
import { Material } from "@/api/interface";

const testApi = () => {
  console.log("testApi");
  getMaterialSidebarListApi().then((res) => {
    console.log("res", res);
  });
};

/**
 * 左侧项目列表
 */
const sidebarList = ref<Material.Indus[]>([]);
onMounted(() => {
  getMaterialSidebarListApi().then((res) => {
    console.log("res", res);
    sidebarList.value = res.data;
  });
});
// 模拟数据
// const sidebarList2 = ref([
//   {
//     indusId: 1,
//     indusName: "教育培训",
//     indusRemark: "教育培训",
//     projectList: [
//       {
//         projectId: 1,
//         projectName: "军队文职",
//         remark: "军队文职",
//       },
//     ],
//   },
//   {
//     indusId: 3,
//     indusName: "书籍应用",
//     indusRemark: "书籍应用",
//     projectList: [
//       {
//         projectId: 5,
//         projectName: "书路阅读",
//         remark: "书路阅读",
//       },
//       {
//         projectId: 6,
//         projectName: "懒懒读书",
//         remark: "懒懒读书",
//       },
//     ],
//   },
//   {
//     indusId: 5,
//     indusName: "汽车",
//     indusRemark: "汽车",
//     projectList: [],
//   },
// ]);
const searchProject = ref(""); // 左侧项目列表，项目搜索框文字
const popoverRef = ref<PopoverInstance>();
const test = (aa: any) => {
  showNoProjectPage.value = false;
  console.log("aa", aa);
  if (aa.index === "3-6") showNoMaterialText.value = true;
  else showNoMaterialText.value = false;
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
// 是否展示项目为空页面
const showNoProjectPage = ref(false);
// 左侧列表是否收起
const isCollapse = ref(false);
const expandSidebar = () => {
  isCollapse.value = false;
};
const foldSidebar = () => {
  isCollapse.value = true;
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
const clearQuery = () => {
  console.log("清空条件");
};
const search = () => {
  console.log("查询素材");
  getUserListApi({ roleId: 13 }).then((res) => {
    console.log("postMenuAddApi", res);
  });
};

/**
 * 素材表格
 */
const batchLabel = ref(""); // 批量操作：分配制作人标签名
const selectedList = ref([]); // 批量选择的素材列表
const tempTable = ref([
  {
    material: "video.mp4",
    name: "video",
    time: "00:10",
    id: "1234456",
    creatTime: "2022-12-14 15:44:50",
    creator: null,
    director: "张三",
    cameraMan: "李四",
    editor: null,
  },
  {
    material: "background.webp",
    name: "background",
    size: "3M",
    id: "12348883",
    creatTime: "2022-12-13 15:44:59",
    creator: "王五",
    director: null,
    cameraMan: "李四",
    editor: "三三",
  },
]);
// 是否展示素材为空样式
const showNoMaterialText = ref(false);

const handleSelectionChange = (val: any) => {
  // console.log("selection change", val);
  selectedList.value = val;
};

// 素材列表分配角色弹窗
const assignDialogVisible = ref(false);
const assignDialogTitle = ref("");
const curAssignRole = ref("");
type Producer = keyof typeof roleEnum;
type ProducerForm = {
  [k in Producer]?: any;
};
const roleEnum = {
  batch: "制作人", // 批量分配，标题统称制作人
  creator: "创建人",
  director: "编导",
  cameraMan: "摄像",
  editor: "剪辑",
};
const roleForm = reactive<ProducerForm>({
  creator: null,
  director: null,
  cameraMan: null,
  editor: null,
});
const showAssignDialog = (role: Producer) => {
  if (role === "batch") batchLabel.value = "";
  curAssignRole.value = role;
  console.log("showAssignDialog", role);
  assignDialogTitle.value = "分配" + roleEnum[role];
  assignDialogVisible.value = true;
};
const cancleAssign = () => {
  console.log("取消分配");
  assignDialogVisible.value = false;
  // tempAssignPersonId.value = null;
};
const assign = () => {
  assignDialogVisible.value = false;
  originalAssiginPerson.value = mockTeamworkers.find((p) => p.id === tempAssignPersonId.value);
  console.log("assign", originalAssiginPerson.value);
};
// 模拟数据
const mockTeamworkers = [
  { id: 1, name: "张一" },
  { id: 2, name: "张二" },
  { id: 3, name: "张三" },
  { id: 4, name: "李四" },
  { id: 5, name: "王五" },
];
const originalAssiginPerson = ref();
const tempAssignPersonId = ref(null);
const handleCloseAssignDialog = () => {
  console.log("关闭分配弹窗");
  tempAssignPersonId.value = null;
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
  teamworker: <any>[], // 协作者
  notes: "", // 备注
});

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

const appointDisabled = ref(false);
const appointSelectRef = ref();
const test3 = () => {
  // console.log("点击下拉框", appointSelectRef);
  appointSelectRef.value.blur();
  console.log("projectForm", projectForm.teamworker);
  console.log("allDeptTeamworkerChecked", allDeptTeamworkerChecked.value);
  // console.log("equal", projectForm.teamworker === allDeptTeamworkerChecked.value);

  teamworkerDialogVisible.value = true;
  // appointDisabled.value = true;
};
const removeTag = (workerId: number) => {
  console.log("removeTag", workerId);
  deleteByIdFromArr(allDeptTeamworkerChecked.value, workerId);
};
const cancleProjectForm = () => {
  console.log("取消项目表单");
  projectDialogVisible.value = false;
};
const submitProjectForm = () => {
  console.log("提交项目表单");
  projectDialogVisible.value = false;
};
// **工具方法** 从一个包含id属性的对象组成的数组里，删除某个特定id的对象
interface ObjwithId {
  id: number;
  [k: string]: any;
}
const deleteByIdFromArr = (arr: ObjwithId[], id: number) => {
  const index = arr.findIndex((item) => item.id === id);
  if (index !== -1) arr.splice(index, 1);
};

/**
 * 选择协作者弹窗
 */
interface Teamworker {
  id: number;
  name: string;
}

const teamworkerDialogVisible = ref(false);
const teamworkerCheckAll = ref(false);
const isIndeterminate = ref(false);
const teamworkerChecked = ref<Teamworker[]>([]);
const optionalTeamworkers = ref<Teamworker[]>([
  { id: 1, name: "张一" },
  { id: 2, name: "张二" },
  { id: 3, name: "张三" },
  { id: 4, name: "李四" },
  { id: 5, name: "王五" },
]);
// const teamworkerRes = ref<Teamworker[]>(); // 已选协作者，可能包含不同部门的

// 点击协作者弹窗，全部协作者
const handleTeamworkerCheckAllChange = (allCheck: boolean) => {
  console.log("allcheck", allCheck);
  console.log("before", teamworkerChecked.value);
  // 从右侧已选集合里删除所有 左侧当前勾选（可能为部分选择） 的对象
  teamworkerChecked.value.forEach((worker) => {
    let allDeptWorkerIdList = allDeptTeamworkerChecked.value.map((x) => x.id);
    let index = allDeptWorkerIdList.indexOf(worker.id);
    allDeptTeamworkerChecked.value.splice(index, 1);
  });

  teamworkerChecked.value = allCheck ? JSON.parse(JSON.stringify(optionalTeamworkers.value)) : [];
  // 从右侧已选集合里添加所有 左侧当前勾选（全选或为空） 的对象
  teamworkerChecked.value.forEach((worker) => {
    allDeptTeamworkerChecked.value.push(worker);
  });
  console.log("after", teamworkerChecked.value);
  isIndeterminate.value = false;
};
// 点击协作者弹窗，整个协作者组
const handleTeamworkerGroupChange = (teamworkers: Teamworker[]) => {
  console.log("teamgroup", teamworkers);
  const checkedCount = teamworkers.length;
  teamworkerCheckAll.value = checkedCount === optionalTeamworkers.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < optionalTeamworkers.value.length;
  teamworkers.forEach((worker) => {
    if (!allDeptTeamworkerChecked.value?.some((w) => w.id === worker.id)) {
      allDeptTeamworkerChecked.value?.push(worker);
    }
  });
};
// 点击协作者弹窗，单个协作者
const handleTeamworkerSingleChange = (checked: boolean, teamworker: Teamworker) => {
  console.log("single", checked, teamworker);
  // 取消某个协作者时，同时取消右侧已选集合中的该协作者
  if (checked === false) {
    let index = allDeptTeamworkerChecked.value.map((x) => x.id).indexOf(teamworker.id);
    allDeptTeamworkerChecked.value.splice(index, 1);
  }
};
// 点击协作者弹窗，部门1
const chooseDept1 = () => {
  teamworkerCheckAll.value = false;
  isIndeterminate.value = false;
  teamworkerChecked.value = [];
  optionalTeamworkers.value = [
    { id: 1, name: "张一" },
    { id: 2, name: "张二" },
    { id: 3, name: "张三" },
    { id: 4, name: "李四" },
    { id: 5, name: "王五" },
  ];
  let optionalIdList = optionalTeamworkers.value.map((x) => x.id);
  allDeptTeamworkerChecked.value.forEach((w, index) => {
    if (optionalIdList.includes(w.id)) {
      teamworkerChecked.value?.push(allDeptTeamworkerChecked.value[index]);
    }
  });
  const checkedCount = teamworkerChecked.value.length;
  teamworkerCheckAll.value = checkedCount === optionalTeamworkers.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < optionalTeamworkers.value.length;
};
// 点击协作者弹窗，部门2
const chooseDept2 = () => {
  teamworkerCheckAll.value = false;
  isIndeterminate.value = false;
  teamworkerChecked.value = [];
  optionalTeamworkers.value = [
    { id: 8, name: "徐八" },
    { id: 9, name: "徐九" },
    { id: 10, name: "徐十" },
  ];
  let optionalIdList = optionalTeamworkers.value.map((x) => x.id);
  allDeptTeamworkerChecked.value.forEach((w, index) => {
    if (optionalIdList.includes(w.id)) {
      teamworkerChecked.value?.push(allDeptTeamworkerChecked.value[index]);
    }
  });
  const checkedCount = teamworkerChecked.value.length;
  teamworkerCheckAll.value = checkedCount === optionalTeamworkers.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < optionalTeamworkers.value.length;
};
// 右侧已选集合
const allDeptTeamworkerChecked = ref<Teamworker[]>([]);
// 打印右侧已选集合信息
const print = () => {
  console.warn("right", allDeptTeamworkerChecked.value);
};
const deleteChoosenTeamworker = (id: number) => {
  console.log("delete", id);
  let index = allDeptTeamworkerChecked.value.map((x) => x.id).indexOf(id);
  allDeptTeamworkerChecked.value.splice(index, 1);
  let optionalIdList = optionalTeamworkers.value.map((x) => x.id);
  if (optionalIdList.includes(id)) {
    console.log("optionalTeamworkers", optionalTeamworkers.value);
    console.log("teamworkerChecked", teamworkerChecked.value);
    let curIndex = teamworkerChecked.value?.map((x) => x.id).indexOf(id);
    teamworkerChecked.value?.splice(curIndex, 1);
    console.log("optionalTeamworkers2", optionalTeamworkers.value);
    console.log("teamworkerChecked2", teamworkerChecked.value);
    const checkedCount = teamworkerChecked.value.length;
    teamworkerCheckAll.value = checkedCount === optionalTeamworkers.value.length;
    isIndeterminate.value = checkedCount > 0 && checkedCount < optionalTeamworkers.value.length;
  }
};
const cancleTeamworkerChecked = () => {
  teamworkerDialogVisible.value = false;
  // 清空选择协作者表单
};
const saveTeamworkerChecked = () => {
  teamworkerDialogVisible.value = false;
  projectForm.teamworker = allDeptTeamworkerChecked.value.map((x) => x.id);
};

/**
 * 图片、视频详情抽屉
 */
const drawerOpen = ref(false);
const drawerContent = ref<any>(null);
const openDrawer = (material: any) => {
  drawerContent.value = material;
  drawerOpen.value = true;
};
const getImage = (name: string) => {
  return new URL(`/src/assets/images/${name}`, import.meta.url).href;
};
const getVideo = (name: string) => {
  return new URL(`/src/assets/videos/${name}`, import.meta.url).href;
};
onMounted(() => {
  // getVideo();
});
// const videoUrl = ref("");
// const getVideo = async (name: string) => {
//   let m = await import(`@/assets/videos/${name}`);
//   videoUrl.value = m.default;
// };

// 修改抽屉标题
const editTitle = () => {
  console.log("editTitle");
  tempTitle.value = originTitle.value;
  showTitleInput.value = true;
};
const originTitle = ref("video");
const tempTitle = ref("");
const showTitleInput = ref(false);
const saveEditTitle = () => {
  console.log("保存修改标题");
  originTitle.value = tempTitle.value;
  showTitleInput.value = false;
};
const cancelEditTitle = () => {
  console.log("取消修改标题");
  showTitleInput.value = false;
};
// 修改人员信息
const optionalPersons = ref([
  { id: 1, name: "小明" },
  { id: 2, name: "小小" },
  { id: 3, name: "张三" },
]);
let originPerson = optionalPersons.value.find((p) => p.id === 3)!;
const tempPersonId = ref(0);
const showPersonSelect = ref(false);
const selectPerson = () => {
  showPersonSelect.value = true;
  tempPersonId.value = originPerson?.id;
};
const saveSelectPerson = () => {
  console.log("保存已选人物");
  showPersonSelect.value = false;
  originPerson = optionalPersons.value.find((p) => p.id === tempPersonId.value)!;
};
const cancleSelectPerson = () => {
  console.log("取消保存已选人物");
  showPersonSelect.value = false;
};
// 修改存储路径
const pathOptions = [
  {
    value: "教育培训",
    label: "教育培训",
    children: [{ value: "军队文职", label: "军队文职" }],
  },
  {
    value: "汽车",
    label: "汽车",
    children: [{ value: "汽车介绍", label: "汽车介绍" }],
  },
  {
    value: "书籍应用",
    label: "书籍应用",
    children: [
      { value: "懒懒听书", label: "懒懒听书" },
      { value: "书路阅读", label: "书路阅读" },
    ],
  },
];
const pathDialogVisible = ref(false);
const tempPathArr = ref<string[]>([]);
const originalPathStr = ref("教育培训/军队文职");
const openPathDialog = () => {
  console.log("openPathDialog");
  tempPathArr.value = originalPathStr.value.split("/");
  pathDialogVisible.value = true;
};
const saveChangePath = () => {
  console.log("saveChangePath");
  pathDialogVisible.value = false;
  console.log("originPath", originalPathStr.value);
  console.log("tempPath", tempPathArr.value);
  originalPathStr.value = tempPathArr.value.join("/");
};
const cancleChangePath = () => {
  console.log("cancleChangePath");
  pathDialogVisible.value = false;
};
const handlePathChange = (val: any) => {
  console.log("pathChange", val);
};
</script>

<style scoped lang="scss">
.library {
  display: flex;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  // 左侧项目列表
  .aside {
    display: flex;
    position: relative;
    flex-direction: column;
    flex-shrink: 0;
    box-sizing: border-box;
    padding: 20px 12px 0;
    border-right: 4px #f2f2f2 solid;
    width: 200px;
    height: 100%;
    &-button {
      margin-bottom: 20px;
      width: 100%;
      height: 38px;
    }
    &-menu {
      flex: 1;
      height: 50%;
      .el-scrollbar {
        width: 100%;
      }
    }
    &-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        overflow: hidden;
        max-width: 84px;
      }
    }
    &-more {
      height: 20px;
      color: #666666;
      transform: translateX(10px) rotate(90deg);
    }
    &-collapse {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 42px;
    }
    &.narrow {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      width: 44px;
    }
  }

  // 右侧核心内容
  .content {
    // flex-shrink: 1;
    overflow: hidden;
    flex: 1;
    padding: 20px 20px 0;
    &-noproject {
      line-height: 60px;
      text-align: center;
    }
    &-nomaterial {
      line-height: 200px;
      text-align: center;
    }
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
    .el-row {
      align-items: center;
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
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
      // background-color: #f2f2f2;
      &-box {
        position: relative;
        width: 100%;
        height: 100%;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        video {
          width: 100%;
        }
        .icon {
          position: absolute;
          left: 50%;
          top: 50%;
          color: #cccccc;
          transform: translate(-50%, -50%);
        }
      }
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

// 图片、视频详情抽屉
.detail {
  .button {
    margin-left: 12px;
  }
  &-header {
    display: flex;
    align-items: center;
    &-prefix {
      line-height: 32px;
      font-weight: 700;
    }
    &-input {
      flex-grow: 1;
    }
  }
  &-content {
    &-preview {
      margin-bottom: 32px;
      height: 300px;
      .el-image {
        width: 100%;
        height: 100%;
      }
      video {
        width: 100%;
        height: 100%;
      }
    }
    &-material {
      height: 150px;
      .detail-content-info {
        display: flex;
        flex-wrap: wrap;
        div {
          flex-basis: 50%;
        }
      }
    }
    &-teamworker {
      height: 150px;
    }
    &-title {
      margin-bottom: 12px;
      font-weight: 700;
      font-size: 16px;
    }
    &-info {
      font-size: 14px;
      color: #333333;
      .subtitle {
        display: inline-block;
        width: 80px;
      }
      .info-row {
        display: flex;
        margin-bottom: 8px;
        line-height: 24px;
      }
      &-input {
        display: flex;
      }
    }
  }
}
// 存储路径级联表单
.pathDialog {
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
.pointer {
  cursor: pointer;
}
</style>
<style lang="scss">
// 不加 scoped, 用于覆盖 element-plus 样式
.pathDialog {
  .el-dialog__header {
    padding: 0;
  }
}
</style>
