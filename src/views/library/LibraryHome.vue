<template>
  <div class="library">
    <!-- 左侧项目列表 -->
    <aside class="aside" :class="{ narrow: isCollapse }">
      <template v-if="!isCollapse">
        <el-button type="primary" class="aside-button" v-check="[() => showProjectDialog('create'), ['library:project:edit']]">
          创建
        </el-button>
        <el-input
          class="aside-input"
          :prefix-icon="Search"
          placeholder="输入项目名称搜索"
          v-model="searchProjName"
          clearable
        ></el-input>
        <el-row class="aside-menu">
          <el-scrollbar>
            <!-- <el-menu @open="handleOpen" @close="handleClose"> -->
            <el-menu :default-active="materialStore.menuItemIndexGet">
              <template v-for="indus in sidebarList" :key="indus.indusId">
                <!-- 项目列表不为空的使用 el-sub-menu -->
                <el-sub-menu :index="`${indus.indusId}`" v-if="indus.projectList && indus.projectList.length">
                  <template #title>
                    <el-icon><Menu /></el-icon>
                    <span>{{ indus.indusName }}</span>
                  </template>
                  <el-menu-item
                    :index="`${project.projectName}`"
                    @click="clickSiderProject(project)"
                    class="aside-item"
                    v-for="project in indus.projectList"
                    :key="project.projectId"
                  >
                    <el-tooltip :content="project.projectName" placement="right">
                      <span>{{ project.projectName }}</span>
                    </el-tooltip>
                    <el-popover :show-arrow="false" placement="bottom-start" ref="popoverRef" trigger="click">
                      <template #reference>
                        <el-icon :size="12" class="aside-more"><MoreFilled /></el-icon>
                      </template>
                      <!-- <div @click="showProjectDialog('modify', project.projectId)" class="popover-modify"  v-check="[() => showProjectDialog('create'), ['library:material:edit']]">
                        修改
                      </div> -->
                      <div
                        class="popover-modify"
                        v-check="[() => showProjectDialog('modify', project.projectId), ['library:project:edit']]"
                      >
                        修改
                      </div>
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
        <div class="content-title">{{ curProjName }}</div>
      </el-row>
      <el-row>
        <el-col>
          <el-button-group>
            <el-button :type="mediaCategory === 1 ? 'primary' : ''" plain @click="changeToToutiao">头条</el-button>
            <el-button :type="mediaCategory === 4 ? 'primary' : ''" plain @click="changeToKuaishou">快手</el-button>
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
          <el-select v-model="sourceAccount" class="content-account" clearable>
            <el-option
              v-for="ad in adList"
              :key="ad.advertiserId"
              :label="ad.remoteAdvertiserName"
              :value="ad.advertiserId"
            ></el-option>
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
            <el-option label="创建人" :value="1"></el-option>
            <el-option label="编导" :value="2"></el-option>
            <el-option label="摄像" :value="3"></el-option>
            <el-option label="剪辑" :value="4"></el-option>
          </el-select>
          <el-select v-model="searchPerson" class="content-person" @click="getCurProjCollabs">
            <el-option v-for="c in curProjCollabList" :key="c.userId" :label="c.nickName" :value="c.userId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <div class="content-label">素材类型</div>
          <el-select v-model="materialType" class="content-type" placeholder="全部">
            <el-option label="图片" :value="1"></el-option>
            <el-option label="视频" :value="2"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2"><el-button link type="primary" class="content-button" @click="clearQuery">清空</el-button></el-col>
        <el-col :span="2"><el-button type="primary" class="content-button" @click="search">查询</el-button></el-col>
      </el-row>
      <el-row>
        <el-select v-model="batchLabel" placeholder="批量操作" :disabled="!selectedList.length">
          <el-option
            label="分配制作人"
            value="assign"
            v-check="[() => showAssignDialog('batch'), ['library:material:edit']]"
          ></el-option>
          <!-- <el-option label="分配制作人" value="assign" @click="showAssignDialog('batch')"></el-option> -->
        </el-select>
      </el-row>

      <!-- 素材表格 -->
      <div v-if="showNoMaterialText" class="content-nomaterial">暂无数据</div>

      <el-table
        ref="materialTableRef"
        :data="materialTable"
        @selection-change="handleSelectionChange"
        :header-cell-style="{ backgroundColor: '#f2f2f2', fontSize: '14px' }"
        class="table"
        v-sticky="{ top: 0, parent: '.content' }"
        v-else
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="素材" width="400">
          <template #default="scope">
            <div class="table-material">
              <div class="table-material-left" @click="openDrawer(scope.row)">
                <div class="table-material-left-box" v-if="scope.row.materialType === 1">
                  <img :src="scope.row.thumbPath" alt="" />
                  <!-- <img :src="getImage(scope.row.thumbPath)" alt="" /> -->
                </div>
                <div class="table-material-left-box" v-else>
                  <img :src="scope.row.thumbPath" alt="" />
                  <!-- <video :src="scope.row.thumbPath" style="height: 100%"></video> -->
                  <!-- <video :src="getVideo(scope.row.thumbPath)"></video> -->
                  <el-icon class="icon" :size="40"><VideoPlay /></el-icon>
                </div>
              </div>
              <div class="table-material-right">
                <div>{{ scope.row.filename }}</div>
                <div v-if="scope.row.materialType === 2">时长：{{ formatSecond(scope.row.duration) }}</div>
                <div v-if="scope.row.materialType === 1">大小：{{ formatSize(scope.row.size) }}</div>
                <div>ID：{{ scope.row.remoteMaterialId }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <div class="table-button" @click="openDrawer(scope.row)">详情</div>
          </template>
        </el-table-column>
        <el-table-column prop="materialCreateTime" label="创建时间" min-width="200"></el-table-column>
        <el-table-column label="创建人">
          <template #default="scope">
            <div v-if="scope.row.creatorName">{{ scope.row.creatorName }}</div>
            <div v-else>
              <span class="table-button" v-check="[() => showAssignDialog('creator', scope.row), ['library:material:edit']]"
                >分配</span
              >
            </div>
            <!-- <div v-else><span class="table-button" @click="showAssignDialog('creator', scope.row)">分配</span></div> -->
          </template>
        </el-table-column>
        <el-table-column label="参与制作人" min-width="150">
          <template #default="scope">
            <div v-if="scope.row.directorName">编导：{{ scope.row.directorName }}</div>
            <div v-else>
              编导：<span
                class="table-button"
                v-check="[() => showAssignDialog('director', scope.row), ['library:material:edit']]"
                >分配</span
              >
            </div>
            <!-- <div v-else>编导：<span class="table-button" @click="showAssignDialog('director', scope.row)">分配</span></div> -->
            <div v-if="scope.row.cameristName">摄像：{{ scope.row.cameristName }}</div>
            <div v-else>
              摄像：<span
                class="table-button"
                v-check="[() => showAssignDialog('camerist', scope.row), ['library:material:edit']]"
                >分配</span
              >
            </div>
            <!-- <div v-else>摄像：<span class="table-button" @click="showAssignDialog('camerist', scope.row)">分配</span></div> -->
            <div v-if="scope.row.editorName">剪辑：{{ scope.row.editorName }}</div>
            <div v-else>
              剪辑：<span class="table-button" v-check="[() => showAssignDialog('editor', scope.row), ['library:material:edit']]"
                >分配</span
              >
            </div>
            <!-- <div v-else>剪辑：<span class="table-button" @click="showAssignDialog('editor', scope.row)">分配</span></div> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :page-size="pageParams.pageSize"
        :total="pageParams.total"
        @current-change="handlePageChange"
        :hide-on-single-page="true"
        style="height: 60px"
      ></el-pagination>
    </div>

    <!-- 素材列表分配角色弹窗 -->
    <el-dialog v-model="assignDialogVisible" :title="assignDialogTitle" @closed="handleCloseAssignDialog" width="30%">
      <el-form :model="roleForm" label-width="60px" v-if="curAssignRole === 'batch'">
        <el-form-item :label="roleEnum[key]" v-for="(value, key) in roleForm" :key="key">
          <el-select v-model="roleForm[key]">
            <el-option v-for="p in curProjCollabList" :key="p.userId" :label="p.nickName" :value="p.userId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-select v-model="singleAssignUserId" placeholder="请选择" v-else>
        <el-option v-for="p in curProjCollabList" :key="p.userId" :label="p.nickName" :value="p.userId"></el-option>
      </el-select>
      <template #footer>
        <el-button @click="cancleAssign">取消</el-button>
        <el-button type="primary" @click="assign">确定</el-button>
      </template>
    </el-dialog>

    <!-- 创建、修改项目弹窗 -->
    <el-dialog v-model="projectDialogVisible" :title="projectDialogType === 'create' ? '创建项目' : '修改项目'" width="60%">
      <el-form ref="projectFormRef" :model="projectForm" label-width="100px" label-position="left" :rules="projectFormRules">
        <el-form-item label="项目负责人" v-if="projectDialogType !== 'create'">
          <div>{{ projectForm.principal }}</div>
        </el-form-item>
        <el-form-item label="项目名称" prop="projName">
          <el-input v-model="projectForm.projName" maxlength="20" :show-word-limit="true" />
        </el-form-item>
        <el-form-item label="所属行业" prop="indusId">
          <el-select v-model="projectForm.indusId" @click="clickIndusSelect">
            <el-option
              v-for="indus in indusOptioins"
              :key="indus.industryId"
              :label="indus.industryName"
              :value="indus.industryId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="协作者" prop="teamworker">
          <el-radio-group v-model="projectForm.teamworkerType" class="radio-group">
            <el-radio label="all">所有人</el-radio>
            <el-radio label="appoint">指定协作人</el-radio>
          </el-radio-group>
          <el-select
            v-if="projectForm.teamworkerType === 'appoint'"
            ref="appointSelectRef"
            v-model="projectForm.teamworker"
            multiple
            style="width: 100%"
            :disabled="appointDisabled"
            @click="clickCollabSelect"
            @remove-tag="removeTag"
          >
            <el-option
              v-for="item in allDeptTeamworkerChecked"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注（选填）">
          <el-input v-model="projectForm.projRemark" type="textarea" :autosize="{ minRows: 3, maxRows: 5 }"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancleProjectForm">取消</el-button>
        <el-button type="primary" @click="submitProjectForm(projectFormRef)">确定</el-button>
      </template>
    </el-dialog>

    <!-- 选择协作者弹窗 -->
    <el-dialog v-model="teamworkerDialogVisible" title="选择协作者" width="700px">
      <div class="teamworker">
        <div class="teamworker-all">
          <div class="teamworker-all-title">人员</div>
          <div class="teamworker-all-content">
            <div class="teamworker-all-content-left">
              <el-scrollbar>
                <el-menu :default-openeds="['company']" @open="openCollabDeptMenu">
                  <el-sub-menu index="company">
                    <template #title>{{ collabDeptTree[0]?.name }}</template>
                    <el-menu-item
                      v-for="d in collabDeptTree[0]?.childrenList"
                      :key="d.id"
                      :index="`${d.id}`"
                      @click="chooseDept(d)"
                    >
                      {{ d.name }}
                    </el-menu-item>
                  </el-sub-menu>
                </el-menu>
              </el-scrollbar>
            </div>
            <div class="teamworker-all-content-right">
              <el-scrollbar v-if="optionalTeamworkers.length">
                <el-checkbox
                  v-model="teamworkerCheckAll"
                  :indeterminate="isIndeterminate"
                  @change="handleTeamworkerCheckAllChange"
                  >全部</el-checkbox
                >
                <el-checkbox-group v-model="teamworkerChecked" @change="handleTeamworkerGroupChange" class="checkbox-group">
                  <el-checkbox
                    v-for="teamworker in optionalTeamworkers"
                    :key="teamworker.userId"
                    :label="teamworker"
                    @change="(checked: boolean) => handleTeamworkerSingleChange(checked, teamworker)"
                  >
                    {{ teamworker.nickName }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-scrollbar>
            </div>
          </div>
        </div>
        <div class="teamworker-chosen">
          <div class="teamworker-chosen-title">已选 {{ allDeptTeamworkerChecked?.length ?? 0 }}</div>
          <div class="teamworker-chosen-content">
            <el-scrollbar>
              <div
                class="teamworker-chosen-content-row pointer"
                v-for="worker in allDeptTeamworkerChecked"
                :key="worker.userId"
                @click="deleteChoosenTeamworker(worker.userId)"
              >
                <span>{{ worker.nickName }}</span>
                <el-icon><Close /></el-icon>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="cancleTeamworkerChecked">取消</el-button>
        <el-button type="primary" @click="saveTeamworkerChecked">确定</el-button>
      </template>
    </el-dialog>

    <!-- 图片、视频详情抽屉 -->
    <el-drawer v-model="drawerOpen" direction="rtl" :show-close="false" size="50%" class="detail">
      <template #header>
        <div class="detail-header">
          <span class="detail-header-prefix">文件名：</span>
          <span v-if="showTitleInput" class="detail-header-input flx-center">
            <el-input v-model="tempTitle"></el-input>
            <el-button type="primary" @click="saveEditTitle" class="button">保存</el-button>
            <el-button @click="cancelEditTitle">取消</el-button>
          </span>
          <span v-else>{{ drawerContent?.filename }}</span>
        </div>
        <el-icon :size="20" v-check="[editTitle, ['library:material:edit']]" class="pointer" v-if="!showTitleInput"
          ><EditPen
        /></el-icon>
      </template>
      <template #default>
        <div class="detail-content">
          <div class="detail-content-preview" v-if="drawerContent?.materialType === 1">
            <!-- <el-image
              :src="getImage(drawerContent?.thumbPath)"
              :preview-src-list="[getImage(drawerContent?.thumbPath)]"
              fit="contain"
            ></el-image> -->
            <el-image :src="drawerContent?.thumbPath" :preview-src-list="[drawerContent?.thumbPath]" fit="contain"></el-image>
          </div>
          <div class="detail-content-preview" v-else>
            <el-skeleton :loading="isLoadingVideo" style="height: 100%" animated>
              <template #template>
                <el-skeleton-item variant="image" style="height: 100%" />
              </template>
              <template #default>
                <!-- <video :src="getVideo(drawerContent?.thumbPath)" controls></video> -->
                <video :src="drawerContent?.materialPath" controls></video>
              </template>
            </el-skeleton>
          </div>
          <div class="detail-content-material">
            <div class="detail-content-title">素材信息</div>
            <div class="detail-content-info">
              <div class="info-row"><span class="subtitle">素材ID</span>{{ drawerContent?.remoteMaterialId }}</div>
              <div class="info-row">
                <span class="subtitle">储存路径</span>
                <span v-check="[openPathDialog, ['library:material:edit']]" class="flx-align-center pointer">
                  <span>{{ drawerContent?.materialShowPath }}</span>
                  <el-icon style="margin-left: 4px"><EditPen /></el-icon>
                </span>
              </div>
              <div class="info-row"><span class="subtitle">创建时间</span>{{ drawerContent?.materialCreateTime }}</div>
              <div class="info-row">
                <span class="subtitle">素材尺寸</span>{{ drawerContent?.width }}*{{ drawerContent?.height }}
              </div>
              <div class="info-row" v-if="drawerContent?.materialType === 1">
                <span class="subtitle">图片格式</span>{{ drawerContent?.format }}
              </div>
              <div class="info-row" v-else><span class="subtitle">视频格式</span>{{ drawerContent?.format }}</div>
              <div class="info-row" v-if="drawerContent?.materialType === 2">
                <span class="subtitle">视频时长</span>{{ formatSecond(drawerContent?.duration) }}
              </div>
              <div class="info-row"><span class="subtitle">素材大小</span>{{ formatSize(drawerContent?.size) }}</div>
            </div>
          </div>
          <div class="detail-content-teamworker">
            <div class="detail-content-title">人员信息</div>
            <div class="detail-content-info">
              <div class="info-row" v-for="u in drawerUserInfo" :key="u.title">
                <span class="subtitle">{{ u.title }}</span>
                <span v-if="u.isModifying" class="detail-content-info-input">
                  <el-select v-model="u.tempPersonId" size="small">
                    <el-option v-for="p in curProjCollabList" :key="p.userId" :label="p.nickName" :value="p.userId"></el-option>
                  </el-select>
                  <el-button type="primary" @click="saveSelectPerson(u)" class="button" size="small">保存</el-button>
                  <el-button @click="cancleSelectPerson(u)" size="small">取消</el-button>
                </span>
                <span v-else class="flx-align-center">
                  <div v-if="u.personId" v-check="[() => selectPerson(u), ['library:material:edit']]" class="pointer">
                    <span>{{ u.personName }}</span>
                    <el-icon style="margin-left: 4px"><EditPen /></el-icon>
                  </div>
                  <div v-else v-check="[() => selectPerson(u), ['library:material:edit']]" class="pointer main-color">分配</div>
                </span>
              </div>
              <!-- <div class="info-row"><span class="subtitle">创建人</span>张三</div>
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
              <div class="info-row"><span class="subtitle">剪辑</span>分配</div> -->
            </div>
          </div>
        </div>
      </template>
    </el-drawer>

    <!-- 存储路径级联表单 -->
    <el-dialog v-model="pathDialogVisible" :show-close="false" class="pathDialog libPathDialog">
      <div class="pathDialog-title">
        <div class="pathDialog-title-left">行业分类</div>
        <div class="pathDialog-title-right">项目名称</div>
      </div>
      <el-cascader-panel :options="cascaderPathOptions" v-model="cascaderPathArr"></el-cascader-panel>
      <template #footer>
        <el-button @click="cancleChangePath">取消</el-button>
        <el-button type="primary" @click="saveChangePath">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { Search, Menu, MoreFilled, VideoPlay, EditPen, Expand, Fold, Close } from "@element-plus/icons-vue";
import { FormInstance, FormRules, PopoverInstance } from "element-plus";
import {
  getAdvertiserListSearchApi,
  getCollaboratorListApi,
  getIndustryListApi,
  getMaterialDetailsApi,
  getMaterialProducerApi,
  getMaterialSidebarListApi,
  getProjectCollabListApi,
  getProjectDetailsApi,
  postCreateProjectApi,
  postDistributeMaterialProducerApi,
  postEditMaterialDetailsApi,
  postGetMaterialListApi,
  postUpdateProjectApi,
} from "@/api/biz/material";
import { Material } from "@/api/interface";
import { useGlobalStore } from "@/store";
import { useMaterialStore } from "@/store/material";
import { onBeforeRouteLeave } from "vue-router";

const materialStore = useMaterialStore();

/**
 * 左侧项目列表
 */
const sidebarList = ref<Material.Indus[]>([]);
getMaterialSidebarListApi().then((res) => {
  sidebarList.value = res.data;
});

const searchProjName = ref(""); // 左侧项目列表，项目搜索框文字
const searchProject = () => {
  getMaterialSidebarListApi({ projName: searchProjName.value }).then((res) => {
    sidebarList.value = res.data;
  });
};
let searchProjTimer: any = null;
watch(searchProjName, (newVal, oldVal) => {
  if (searchProjTimer) clearTimeout(searchProjTimer);
  searchProjTimer = setTimeout(() => {
    searchProject();
  }, 1000);
});
const popoverRef = ref<PopoverInstance>();
const curProjId = ref(); // 点击时选中的项目Id，页面中会用到
const curProjName = ref(""); // 点击时选中的项目名
const globalStore = useGlobalStore();
const clickSiderProject = (project: any) => {
  selectedList.value = []; // 点击左侧栏时不同项目时，disable 批量分配制作人下拉框
  curProjCollabList.value = []; // 点击左侧栏时不同项目时，清空当前项目的协作者列表
  curProjId.value = project.projectId;
  curProjName.value = project.projectName;
  materialStore.setProject(project);
  sourceAccount.value = "";
  // 获取来源账号列表，接口获取，v1版本只有头条来源的
  getAdvertiserListSearchApi({ appType: appType.value, projectId: curProjId.value }).then((res) => {
    adList.value = res.data;
  });
  if (
    (!project.collabList || !project.collabList.includes(globalStore.id)) &&
    !globalStore.roleCodeList.includes("SuperAdministrator")
  ) {
    // 如果当前用户不是项目的协作者，并且不是超级管理员，则不可看当前项目
    ElMessage.warning("不是当前项目的协作者，请联系管理员添加");
    showNoMaterialText.value = true;
    pageParams.total = 0;
    return;
  }
  showNoProjectPage.value = false;
  // console.log("curProjId", project);
  search();
  // let params = {
  //   projId: curProjId.value,
  //   mediaCategory: 1,
  //   pageNum: 1,
  //   pageSize: 30,
  // };
  // postGetMaterialListApi(params).then((res) => {
  //   console.log("postGetMaterialListApi", res.data);
  //   if (!res.data.list || !res.data.list.length) {
  //     showNoMaterialText.value = true;
  //   } else {
  //     materialTable.value = res.data.list;
  //     showNoMaterialText.value = false;
  //   }
  //   pageParams.total = res.data.total;
  // });
};
onMounted(() => {
  // 如果进入页面时已有 materialStore.projId，则触发点击效果进入到该项目
  if (materialStore.project.projectName) {
    clickSiderProject(materialStore.project);
  }
});
onBeforeRouteLeave(() => {
  // 离开当前路由时，清空 materialStore 里的缓存
  materialStore.$reset();
});
// const handleOpen = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath);
// };
// const handleClose = (key: string, keyPath: string[]) => {
//   console.log(key, keyPath);
// };
// const popoverClose = () => {
//   // popoverRef.value?.hide();
// };
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
const mediaCategory = ref(1); // 1-头条; 2-百度; 3-广点通; 4-快手
const appType = ref(1); // 应用类型，巨量引擎（头条）：1 巨量千川（千川）：2 磁力引擎（快手）：3 磁力金牛：4
const daterange = ref<Date[]>([]); // 创建时间：时间范围
const sourceAccount = ref(""); // 来源账号
const adList = ref<any[]>([]); // 来源账号列表，接口获取，v1版本只有头条来源的
const materialName = ref(""); // 素材名称/id
const searchRole = ref(1); // 角色，默认创建人
const searchPerson = ref(""); // 人员
const materialType = ref(""); // 素材类型： 1-图片; 2-视频
daterange.value = getThisMonthDateRangeArr();

// 获取来源账号列表，接口获取，v1版本只有头条来源的
getAdvertiserListSearchApi({ appType: appType.value }).then((res) => {
  adList.value = res.data;
});
const getCurProjCollabs = () => {
  if (!curProjId.value) return;
  if (!curProjCollabList.value || !curProjCollabList.value.length) {
    getProjectCollabListApi({ projId: curProjId.value }).then((res) => {
      curProjCollabList.value = res.data;
    });
  }
};

// **工具方法** 获取当月1号到当前时间的时间范围，用于 element-plus 的时间选择器
function getThisMonthDateRangeArr() {
  let now = new Date();
  let curYear = now.getFullYear();
  let curMonth = now.getMonth() + 1;
  let startTime = new Date(`${curYear}-${curMonth}-01 00:00:00`);
  let endTime = now;
  return [startTime, endTime];
}
// **工具方法** 格式化时间
function formatDate(date: Date, format = "yyyy-MM-dd") {
  try {
    let year = String(date.getFullYear());
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");
    // let hour = String(date.getHours()).padStart(2, "0");
    // let min = String(date.getMinutes()).padStart(2, "0");
    // let sec = String(date.getSeconds()).padStart(2, "0");
    // return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
    return format.replace("yyyy", year).replace("MM", month).replace("dd", day);
  } catch (error) {
    return date;
  }
}
const changeToToutiao = () => {
  if (mediaCategory.value != 1) {
    sourceAccount.value = "";
    mediaCategory.value = 1;
    appType.value = 1;
    // 获取来源账号列表，接口获取，v1版本只有头条来源的
    getAdvertiserListSearchApi({ appType: appType.value, projectId: curProjId.value }).then((res) => {
      adList.value = res.data;
    });
    search();
  }
};
const changeToKuaishou = () => {
  if (mediaCategory.value != 4) {
    sourceAccount.value = "";
    mediaCategory.value = 4;
    appType.value = 3;
    // 获取来源账号列表，接口获取，v1版本只有头条来源的
    getAdvertiserListSearchApi({ appType: appType.value, projectId: curProjId.value }).then((res) => {
      adList.value = res.data;
    });
    search();
  }
};
const clearQuery = () => {
  daterange.value = getThisMonthDateRangeArr();
  sourceAccount.value = "";
  materialName.value = "";
  searchRole.value = 1;
  searchPerson.value = "";
  materialType.value = "";
};
const search = () => {
  if (!curProjId.value) return;
  let params = <any>{
    projId: curProjId.value,
    mediaCategory: mediaCategory.value,
    pageNum: 1,
    pageSize: 30,
  };
  if (daterange.value && daterange.value.length) {
    params.materialCreateStartTime = formatDate(daterange.value[0]);
    params.materialCreateEndTime = formatDate(daterange.value[1]);
  }
  if (sourceAccount.value) params.advertiserId = sourceAccount.value;
  if (materialName.value) params.filename = materialName.value;
  if (searchRole.value && searchPerson.value) {
    params.collabType = searchRole.value;
    params.collabUserId = searchPerson.value;
  }
  if (materialType.value) params.materialType = materialType.value;
  // console.log("pa", params);

  postGetMaterialListApi(params).then((res) => {
    if (!res.data.list || !res.data.list.length) {
      showNoMaterialText.value = true;
    } else {
      materialTable.value = res.data.list;
      showNoMaterialText.value = false;
    }
    pageParams.total = res.data.total;
  });
};

/**
 * 素材表格
 */
const batchLabel = ref(""); // 批量操作：分配制作人标签名
const selectedList = ref([]); // 批量选择的素材列表
const materialTable = ref([]); // 素材表格内容
const materialTableRef = ref<any>();
// const tempTable = ref([
//   {
//     thumbPath: "",
//     materialId: 1,
//     remoteMaterialId: 545,
//     materialType: 2,
//     filename: "视频1",
//     duration: 20948.864,
//     size: 344354562,
//     materialCreateTime: "2023-02-10 17:55:51",
//     creatorName: "",
//     directorName: "",
//     cameristName: "",
//     editorName: "",
//   },
//   {
//     thumbPath: "",
//     materialId: 1,
//     remoteMaterialId: 546,
//     materialType: 1,
//     filename: "图片2",
//     duration: 20948.864,
//     size: 344354562,
//     materialCreateTime: "2023-02-10 17:55:51",
//     creatorName: "",
//     directorName: "",
//     cameristName: "",
//     editorName: "",
//   },
// ]);
// 是否展示素材为空样式
const showNoMaterialText = ref(false);
// **工具方法** 时间格式化方法
const formatSecond = (seconds: number) => {
  let hour = String(~~(seconds / 3600)).padStart(2, "0");
  let min = String(~~((seconds % 3600) / 60)).padStart(2, "0");
  let sec = String(~~(seconds % 60)).padStart(2, "0");
  if (hour === "00") return `${min}:${sec}`;
  else return `${hour}:${min}:${sec}`;
};
// **工具方法** 文件体积格式化方法
const formatSize = (size: number) => {
  let giga = size / 1024 / 1024 / 1024;
  if (giga > 1) return `${giga.toFixed(1)}G`;
  let mega = size / 1024 / 1024;
  if (mega > 1) return `${mega.toFixed(1)}M`;
  let kilo = size / 1024;
  return `${kilo.toFixed(1)}K`;
};

const handleSelectionChange = (val: any) => {
  console.log("selection change", val);
  selectedList.value = val;
};
// 素材列表分配角色弹窗
const assignDialogVisible = ref(false);
const assignDialogTitle = ref("");
const curAssignRole = ref("");
const curAssignMaterial = ref<any>(null);
const curProjCollabList = ref<any[]>([]); // 当前项目的协作者列表

type Producer = keyof typeof roleEnum;
type ProducerForm = {
  [k in Producer]?: any;
};
const roleEnum = {
  batch: "制作人", // 批量分配，标题统称制作人
  creator: "创建人",
  director: "编导",
  camerist: "摄像",
  editor: "剪辑",
};
const roleForm = reactive<ProducerForm>({
  creator: null,
  director: null,
  camerist: null,
  editor: null,
});
const showAssignDialog = (role: Producer, row?: any) => {
  // console.log("row", row);
  if (row) curAssignMaterial.value = row;
  if (role === "batch") {
    batchLabel.value = "";
    curAssignMaterial.value = null;
  }
  // console.log("CURPROJID", curProjId.value);
  if (!curProjCollabList.value || !curProjCollabList.value.length) {
    getProjectCollabListApi({ projId: curProjId.value }).then((res) => {
      console.log("getProjectCollabListApi", res);
      curProjCollabList.value = res.data;
    });
  }

  curAssignRole.value = role;
  console.log("showAssignDialog", role);
  assignDialogTitle.value = "分配" + roleEnum[role];
  assignDialogVisible.value = true;
};
const cancleAssign = () => {
  console.log("取消分配");
  assignDialogVisible.value = false;
};
const assign = () => {
  // console.log("curProjId", curProjId.value);
  // console.log("curAssignMaterial materialId", curAssignMaterial.value?.materialId);
  // console.log("batch materialId", materialTable.value);
  // console.log("curAssignRole", curAssignRole.value);
  // console.log("singleAssignUserId", singleAssignUserId.value);
  // console.log("batchAssignUserId", roleForm);
  let params = <any>{
    materialList: [],
  };
  if (curAssignRole.value === "batch") {
    // 批量分配制作人

    params.materialList = materialTableRef.value.getSelectionRows().map((m: any) => m.materialId);
    // params.materialList = materialTable.value.map((m: any) => m.materialId);
    if (roleForm.creator) {
      params.creatorId = roleForm.creator;
      params.creatorNickName = curProjCollabList.value.find((c: any) => c.userId === roleForm.creator)?.nickName;
    }
    if (roleForm.director) {
      params.directorId = roleForm.director;
      params.directorNickName = curProjCollabList.value.find((c: any) => c.userId === roleForm.director)?.nickName;
    }
    if (roleForm.camerist) {
      params.cameristId = roleForm.camerist;
      params.cameristNickName = curProjCollabList.value.find((c: any) => c.userId === roleForm.camerist)?.nickName;
    }
    if (roleForm.editor) {
      params.editorId = roleForm.editor;
      params.editorNickName = curProjCollabList.value.find((c: any) => c.userId === roleForm.editor)?.nickName;
    }
  } else {
    // 单个分配制作人
    params.materialList = [curAssignMaterial.value.materialId];
    if (singleAssignUserId.value) {
      params[`${curAssignRole.value}Id`] = singleAssignUserId.value;
      params[`${curAssignRole.value}NickName`] = curProjCollabList.value.find(
        (c: any) => c.userId === singleAssignUserId.value
      )?.nickName;
    }
  }
  if (Object.keys(params).length < 3) {
    cancleAssign();
    return;
  }
  postDistributeMaterialProducerApi(params).then((res) => {
    assignDialogVisible.value = false;
    ElMessage.success("分配成功");
    search();
  });

  // originalAssiginPerson.value = curProjCollabList.value.find((p) => p.userId === singleAssignUserId.value);
  // console.log("assign", originalAssiginPerson.value);
};
// 模拟数据
const singleAssignUserId = ref<any>(null);
const handleCloseAssignDialog = () => {
  console.log("关闭分配弹窗");
  singleAssignUserId.value = null; // 清空单个分配的下拉框
  roleForm.creator = null; // 清空批量分配的下拉框
  roleForm.director = null; // 清空批量分配的下拉框
  roleForm.camerist = null; // 清空批量分配的下拉框
  roleForm.editor = null; // 清空批量分配的下拉框
};

/**
 * 创建、修改项目弹窗
 */
const projectFormRef = ref<FormInstance>();
const projectDialogVisible = ref(false);
const projectDialogType = ref("create");
const projectForm = reactive({
  projId: <undefined | number>undefined, // 项目ID，修改项目的接口需要用到
  principal: "", // 项目负责人
  projName: "", // 项目名称
  indusId: "", // 行业ID
  teamworkerType: "appoint", // 协作者类型：所有人all / 指定协作人appoint
  teamworker: <number[]>[], // 协作者 id 列表
  projRemark: "", // 备注
});
const indusOptioins = ref<any[]>([]);
// v1 版本中没有根据用户id查得所有公司deptId的接口，临时写死id=8
// let tempCompanyDeptId = 8;

const validateProjName = (rule: any, value: string, callback: any) => {
  if (value.trim() === "") {
    callback(new Error("请输入项目名称"));
  } else {
    callback();
  }
};
const validateIndusId = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error("请选项所属行业"));
  } else {
    callback();
  }
};
const validateTeamworker = (rule: any, value: string, callback: any) => {
  if (projectForm.teamworkerType === "appoint" && (!value || !value.length)) {
    callback(new Error("请选择协作者"));
  } else {
    callback();
  }
};

const projectFormRules = reactive<FormRules>({
  projName: [{ validator: validateProjName, trigger: "blur" }],
  indusId: [{ validator: validateIndusId, trigger: "change" }],
  teamworker: [{ validator: validateTeamworker, trigger: "change" }],
});

const showProjectDialog = (from: string, projId?: number) => {
  projectFormRef.value?.resetFields(); // 清空创建、修改项目的表单检验
  projectForm.projId = undefined;
  projectForm.principal = "";
  projectForm.projName = "";
  projectForm.indusId = "";
  projectForm.teamworkerType = "appoint";
  projectForm.teamworker = [];
  projectForm.projRemark = "";
  projectDialogType.value = from;
  projectDialogVisible.value = true;
  allDeptTeamworkerChecked.value = [];
  if (!indusOptioins.value || !indusOptioins.value.length) {
    getIndustryListApi().then((res) => {
      indusOptioins.value = res.data;
    });
  }
  // if (from === "create") {
  // }
  if (from === "modify") {
    // popoverClose();
    if (projId) {
      projectForm.projId = projId;
      getProjectDetailsApi({ projId }).then((res) => {
        console.log("getProjectDetailsApi", res.data);
        projectForm.principal = res.data.projCreatedByNickName;
        projectForm.projName = res.data.projName;
        projectForm.indusId = res.data.indusId;
        projectForm.projRemark = res.data.projRemark;
        if (res.data.collabList && res.data.collabList.length) {
          // 修改项目时，根据当前项目的协作者id列表，查得对应的协作者 nickName 用于下拉框显示
          if (!collabDeptTree.value || !collabDeptTree.value.length) {
            getCollaboratorListApi().then((r) => {
              console.log("getCollaboratorListApi", r.data);
              collabDeptTree.value = r.data;
              // collabDeptList.value = r.data;
              // collabDeptListExceptCom.value = r.data.filter((d: any) => d.deptId !== tempCompanyDeptId);
              // let userList = collabDeptList.value.reduce((total, cur) => {
              //   return total.concat(cur.userList);
              // }, []);

              let userList = getAllUserList(collabDeptTree.value[0]);
              if (userList.length === res.data.collabList.length) projectForm.teamworkerType = "all";
              else {
                projectForm.teamworkerType = "appoint";
                projectForm.teamworker = res.data.collabList;
                allDeptTeamworkerChecked.value = userList.filter((user: any) => res.data.collabList.includes(user.userId));
              }
            });
          } else {
            // console.log("已有", collabDeptList.value);
            // let userList = collabDeptList.value.reduce((total, cur) => {
            //   return total.concat(cur.userList);
            // }, []);
            let userList = getAllUserList(collabDeptTree.value[0]);
            if (userList.length === res.data.collabList.length) projectForm.teamworkerType = "all";
            else {
              projectForm.teamworkerType = "appoint";
              projectForm.teamworker = res.data.collabList;
              allDeptTeamworkerChecked.value = userList.filter((user: any) => res.data.collabList.includes(user.userId));
            }
          }
        }
      });
    }
  }
};
// 点击所属行业下拉框
const clickIndusSelect = () => {
  if (!indusOptioins.value || !indusOptioins.value.length) {
    getIndustryListApi().then((res) => {
      indusOptioins.value = res.data;
    });
  }
};

const appointDisabled = ref(false);
const appointSelectRef = ref();
// 点击协作者下拉框
const clickCollabSelect = async () => {
  appointSelectRef.value.blur();
  // console.log("projectForm", projectForm.teamworker);
  // console.log("allDeptTeamworkerChecked", allDeptTeamworkerChecked.value);
  // console.log("equal", projectForm.teamworker === allDeptTeamworkerChecked.value);
  // if (!collabDeptListExceptCom.value || !collabDeptListExceptCom.value.length) {
  //   await getCollaboratorListApi().then((res) => {
  //     console.log("getCollaboratorListApi", res.data);
  //     collabDeptList.value = res.data;
  //     collabDeptListExceptCom.value = res.data.filter((d: any) => d.deptId !== tempCompanyDeptId);
  //   });
  // }
  if (!collabDeptTree.value || !collabDeptTree.value.length) {
    await getCollaboratorListApi().then((res) => {
      collabDeptTree.value = res.data;
    });
  }
  // 取出所有部门的所有人员用于初始展示
  optionalTeamworkers.value = getAllUserList(collabDeptTree.value[0]);

  // 匹配右侧已选的列表，给左侧可选列表打勾
  teamworkerCheckAll.value = false;
  isIndeterminate.value = false;
  teamworkerChecked.value = [];
  let optionalIdList = optionalTeamworkers.value.map((x) => x.userId);
  allDeptTeamworkerChecked.value.forEach((w, index) => {
    if (optionalIdList.includes(w.userId)) {
      teamworkerChecked.value.push(allDeptTeamworkerChecked.value[index]);
    }
  });
  let checkedCount = teamworkerChecked.value.length;
  teamworkerCheckAll.value = checkedCount === optionalTeamworkers.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < optionalTeamworkers.value.length;

  teamworkerDialogVisible.value = true;
  // appointDisabled.value = true;
};

// **工具方法** 从树状结构中取出所有层次对象里的 userList 数组并拼接
function getAllUserList(curObj: any) {
  let res: any[] = [];
  if (curObj.userList && curObj.userList.length) res = res.concat(curObj.userList);
  if (curObj.childrenList && curObj.childrenList.length) {
    curObj.childrenList.forEach((child: any) => {
      res = res.concat(getAllUserList(child));
    });
  }
  return res;
}

const removeTag = (workerId: number) => {
  console.log("removeTag", workerId);
  deleteByIdFromArr(allDeptTeamworkerChecked.value, workerId);
};
const cancleProjectForm = () => {
  console.log("取消项目表单", projectForm);
  projectDialogVisible.value = false;
};

const submitProjectForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      console.log("提交项目表单");
      projectDialogVisible.value = false;
      // 调接口提取所有协作者的 id
      let params = <any>{
        projName: projectForm.projName,
        indusId: projectForm.indusId,
        collabList: [],
      };
      if (projectForm.projRemark) params.projRemark = projectForm.projRemark;
      if (projectForm.teamworkerType === "appoint") {
        // 路径一：创建项目时指定协作人
        params.collabList = projectForm.teamworker;
        console.log("submit appoint", params);
        if (projectDialogType.value === "create") {
          postCreateProjectApi(params).then((res) => {
            ElMessage.success(`项目创建成功`);
            location.reload();
          });
        } else {
          params.projId = projectForm.projId;
          postUpdateProjectApi(params).then((res) => {
            ElMessage.success(`项目修改成功`);
            materialStore.setProject({ collabList: params.collabList, projectId: params.projId, projectName: params.projName });
            location.reload();
          });
        }
      } else {
        // 创建项目时指定所有人
        if (!collabDeptTree.value || !collabDeptTree.value.length) {
          // 路径二：没有所有协作者信息时，重新调接口
          getCollaboratorListApi().then((res) => {
            console.warn(res.data);
            collabDeptTree.value = res.data;
            // collabDeptList.value = res.data;
            // collabDeptListExceptCom.value = res.data.filter((d: any) => d.deptId !== tempCompanyDeptId);
            // params.collabList = collabDeptList.value.reduce((total, cur) => {
            //   total = total.concat(cur.userList.map((u: any) => u.userId));
            //   return total;
            // }, []);
            params.collabList = getAllUserList(collabDeptTree.value[0]).map((u: any) => u.userId);
            // console.log("submit all new", params);
            if (projectDialogType.value === "create") {
              postCreateProjectApi(params).then((res) => {
                ElMessage.success(`项目创建成功`);
                location.reload();
              });
            } else {
              params.projId = projectForm.projId;
              postUpdateProjectApi(params).then((res) => {
                ElMessage.success(`项目修改成功`);
                materialStore.setProject({
                  collabList: params.collabList,
                  projectId: params.projId,
                  projectName: params.projName,
                });
                location.reload();
              });
            }
          });
        } else {
          // 路径三：已有所有协作者信息时，直接取已有信息
          // params.collabList = collabDeptList.value.reduce((total, cur) => {
          //   total = total.concat(cur.userList.map((u: any) => u.userId));
          //   return total;
          // }, []);
          params.collabList = getAllUserList(collabDeptTree.value[0]).map((u: any) => u.userId);
          console.log("submit all exist", params);
          if (projectDialogType.value === "create") {
            postCreateProjectApi(params).then((res) => {
              ElMessage.success(`项目创建成功`);
              location.reload();
            });
          } else {
            params.projId = projectForm.projId;
            postUpdateProjectApi(params).then((res) => {
              ElMessage.success(`项目修改成功`);
              materialStore.setProject({ collabList: params.collabList, projectId: params.projId, projectName: params.projName });
              location.reload();
            });
          }
        }
      }
    } else {
      console.log("error");
      return false;
    }
  });
};
// **工具方法** 从一个包含id属性的对象组成的数组里，删除某个特定id的对象
interface ObjwithId {
  userId: number;
  [k: string]: any;
}
const deleteByIdFromArr = (arr: ObjwithId[], id: number) => {
  const index = arr.findIndex((item) => item.userId === id);
  if (index !== -1) arr.splice(index, 1);
};

/**
 * 选择协作者弹窗
 */
interface Teamworker {
  userId: number;
  nickName: string;
}

const teamworkerDialogVisible = ref(false);
const teamworkerCheckAll = ref(false); // 选择协作者弹窗，全部按钮是否勾选
const isIndeterminate = ref(false); // 选择协作者弹窗，全部按钮是否为中间状态（仅勾选部分）
const teamworkerChecked = ref<Teamworker[]>([]); // 选择协作者弹窗，左侧已勾选列表
const optionalTeamworkers = ref<Teamworker[]>([]); // 选择协作者弹窗，左侧可勾选列表
// const optionalTeamworkers = ref<Teamworker[]>([
//   { id: 1, name: "张一" },
//   { id: 2, name: "张二" },
//   { id: 3, name: "张三" },
//   { id: 4, name: "李四" },
//   { id: 5, name: "王五" },
// ]);
const collabDeptTree = ref<any[]>([]); // 选择协作者弹窗，左侧公司树，新接口直接返回树
// const collabDeptList = ref<any[]>([]); // 选择协作者弹窗，左侧公司、部门列表
// const collabDeptListExceptCom = ref<any[]>([]); // 选择协作者弹窗，因为后端返回的公司和部门平级，只显示部门，用于指定协作人弹窗左侧部门列表，不显示公司
const allDeptTeamworkerChecked = ref<Teamworker[]>([]); // 选择协作者弹窗，右侧已选集合，可能包含不同部门人员

// 点击协作者弹窗，全部协作者
const handleTeamworkerCheckAllChange = (allCheck: boolean) => {
  console.log("allcheck", allCheck);
  console.log("before", teamworkerChecked.value);
  // 从右侧已选集合里删除所有 左侧当前勾选（可能为部分选择） 的对象
  teamworkerChecked.value.forEach((worker) => {
    let allDeptWorkerIdList = allDeptTeamworkerChecked.value.map((x) => x.userId);
    let index = allDeptWorkerIdList.indexOf(worker.userId);
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
    if (!allDeptTeamworkerChecked.value?.some((w) => w.userId === worker.userId)) {
      allDeptTeamworkerChecked.value?.push(worker);
    }
  });
};
// 点击协作者弹窗，单个协作者
const handleTeamworkerSingleChange = (checked: boolean, teamworker: Teamworker) => {
  console.log("single", checked, teamworker);
  // 取消某个协作者时，同时取消右侧已选集合中的该协作者
  if (checked === false) {
    let index = allDeptTeamworkerChecked.value.map((x) => x.userId).indexOf(teamworker.userId);
    allDeptTeamworkerChecked.value.splice(index, 1);
  }
};
// 点击协作者弹窗，部门
const chooseDept = (dept: any) => {
  console.log("chooseDept", dept);
  teamworkerCheckAll.value = false;
  isIndeterminate.value = false;
  teamworkerChecked.value = [];
  optionalTeamworkers.value = dept.userList;
  let optionalIdList = optionalTeamworkers.value.map((x) => x.userId);
  allDeptTeamworkerChecked.value.forEach((w, index) => {
    if (optionalIdList.includes(w.userId)) {
      teamworkerChecked.value.push(allDeptTeamworkerChecked.value[index]);
    }
  });
  let checkedCount = teamworkerChecked.value.length;
  teamworkerCheckAll.value = checkedCount === optionalTeamworkers.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < optionalTeamworkers.value.length;
};
// 点击协作者弹窗，展开公司树时的回调
const openCollabDeptMenu = (index: any, indexPath: any) => {
  console.log("openCollabDeptMenu", index, indexPath);
};
// 点击协作者弹窗，部门1
// const chooseDept1 = () => {
//   teamworkerCheckAll.value = false;
//   isIndeterminate.value = false;
//   teamworkerChecked.value = [];
//   optionalTeamworkers.value = [
//     { id: 1, name: "张一" },
//     { id: 2, name: "张二" },
//     { id: 3, name: "张三" },
//     { id: 4, name: "李四" },
//     { id: 5, name: "王五" },
//   ];
//   let optionalIdList = optionalTeamworkers.value.map((x) => x.id);
//   allDeptTeamworkerChecked.value.forEach((w, index) => {
//     if (optionalIdList.includes(w.id)) {
//       teamworkerChecked.value?.push(allDeptTeamworkerChecked.value[index]);
//     }
//   });
//   const checkedCount = teamworkerChecked.value.length;
//   teamworkerCheckAll.value = checkedCount === optionalTeamworkers.value.length;
//   isIndeterminate.value = checkedCount > 0 && checkedCount < optionalTeamworkers.value.length;
// };
// 点击协作者弹窗，部门2
// const chooseDept2 = () => {
//   teamworkerCheckAll.value = false;
//   isIndeterminate.value = false;
//   teamworkerChecked.value = [];
//   optionalTeamworkers.value = [
//     { id: 8, name: "徐八" },
//     { id: 9, name: "徐九" },
//     { id: 10, name: "徐十" },
//   ];
//   let optionalIdList = optionalTeamworkers.value.map((x) => x.id);
//   allDeptTeamworkerChecked.value.forEach((w, index) => {
//     if (optionalIdList.includes(w.id)) {
//       teamworkerChecked.value?.push(allDeptTeamworkerChecked.value[index]);
//     }
//   });
//   const checkedCount = teamworkerChecked.value.length;
//   teamworkerCheckAll.value = checkedCount === optionalTeamworkers.value.length;
//   isIndeterminate.value = checkedCount > 0 && checkedCount < optionalTeamworkers.value.length;
// };

const deleteChoosenTeamworker = (id: number) => {
  console.log("delete", id);
  let index = allDeptTeamworkerChecked.value.map((x) => x.userId).indexOf(id);
  allDeptTeamworkerChecked.value.splice(index, 1);
  let optionalIdList = optionalTeamworkers.value.map((x) => x.userId);
  if (optionalIdList.includes(id)) {
    console.log("optionalTeamworkers", optionalTeamworkers.value);
    console.log("teamworkerChecked", teamworkerChecked.value);
    let curIndex = teamworkerChecked.value?.map((x) => x.userId).indexOf(id);
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
  projectForm.teamworker = allDeptTeamworkerChecked.value.map((x) => x.userId);
};

/**
 * 分页相关
 */
const pageParams = reactive({
  pageNum: 1,
  pageSize: 30,
  total: 20,
});
const handlePageChange = (pageNum: number) => {
  let params = <any>{
    projId: curProjId.value,
    mediaCategory: mediaCategory.value,
    pageNum: pageNum,
    pageSize: 30,
  };
  if (daterange.value && daterange.value.length) {
    params.materialCreateStartTime = formatDate(daterange.value[0]);
    params.materialCreateEndTime = formatDate(daterange.value[1]);
  }
  if (sourceAccount.value) params.advertiserId = sourceAccount.value;
  if (materialName.value) params.filename = materialName.value;
  if (searchRole.value && searchPerson.value) {
    params.collabType = searchRole.value;
    params.collabUserId = searchPerson.value;
  }
  if (materialType.value) params.materialType = materialType.value;
  // console.log("pa", params);

  postGetMaterialListApi(params).then((res) => {
    if (!res.data.list || !res.data.list.length) {
      showNoMaterialText.value = true;
    } else {
      materialTable.value = res.data.list;
      showNoMaterialText.value = false;
    }
    pageParams.total = res.data.total;
  });
};

/**
 * 图片、视频详情抽屉
 */
const drawerOpen = ref(false);
const drawerContent = ref<any>(null);
const isLoadingVideo = ref(true); // 给视频添加骨架屏，防止抽屉刚弹出来时视频播放器宽度不对

const openDrawer = (material: any) => {
  isLoadingVideo.value = true;
  setTimeout(() => {
    isLoadingVideo.value = false;
  }, 500);
  showTitleInput.value = false;
  // 打开详情抽屉时清空协作人员信息
  // drawerUserInfo.value = JSON.parse(JSON.stringify(drawerUserInfoOrigin));
  drawerUserInfo.value.creator.isModifying = false;
  drawerUserInfo.value.director.isModifying = false;
  drawerUserInfo.value.camerist.isModifying = false;
  drawerUserInfo.value.editor.isModifying = false;
  drawerUserInfo.value.creator.personId = null;
  drawerUserInfo.value.director.personId = null;
  drawerUserInfo.value.camerist.personId = null;
  drawerUserInfo.value.editor.personId = null;
  drawerUserInfo.value.creator.personName = "";
  drawerUserInfo.value.director.personName = "";
  drawerUserInfo.value.camerist.personName = "";
  drawerUserInfo.value.editor.personName = "";
  drawerUserInfo.value.creator.tempPersonId = null;
  drawerUserInfo.value.director.tempPersonId = null;
  drawerUserInfo.value.camerist.tempPersonId = null;
  drawerUserInfo.value.editor.tempPersonId = null;
  getMaterialDetailsApi({ materialId: material.materialId }).then((res) => {
    drawerContent.value = res.data;
  });
  getMaterialProducerApi({ materialId: material.materialId }).then((res) => {
    if (res.data?.creatorId) drawerUserInfo.value.creator.personId = res.data.creatorId;
    if (res.data?.creatorName) drawerUserInfo.value.creator.personName = res.data.creatorName;
    if (res.data?.directorId) drawerUserInfo.value.director.personId = res.data.directorId;
    if (res.data?.directorName) drawerUserInfo.value.director.personName = res.data.directorName;
    if (res.data?.cameristId) drawerUserInfo.value.camerist.personId = res.data.cameristId;
    if (res.data?.cameristName) drawerUserInfo.value.camerist.personName = res.data.cameristName;
    if (res.data?.editorId) drawerUserInfo.value.editor.personId = res.data.editorId;
    if (res.data?.editorName) drawerUserInfo.value.editor.personName = res.data.editorName;
  });
  if (!curProjCollabList.value || !curProjCollabList.value.length) {
    getProjectCollabListApi({ projId: curProjId.value }).then((res) => {
      curProjCollabList.value = res.data;
    });
  }
  drawerOpen.value = true;
};
// const getImage = (name: string) => {
//   return new URL(`/src/assets/images/${name}`, import.meta.url).href;
// };
// const getVideo = (name: string) => {
//   return new URL(`/src/assets/videos/${name}`, import.meta.url).href;
// };
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
  tempTitle.value = drawerContent.value?.filename;
  showTitleInput.value = true;
};
const tempTitle = ref("");
const showTitleInput = ref(false);
const saveEditTitle = () => {
  // console.log("保存修改标题");
  showTitleInput.value = false;
  let params = {
    materialId: drawerContent.value?.materialId,
    filename: tempTitle.value,
  };
  postEditMaterialDetailsApi(params).then((res) => {
    ElMessage.success("修改素材标题成功");
    search();
    getMaterialDetailsApi({ materialId: drawerContent.value?.materialId }).then((res) => {
      drawerContent.value = res.data;
    });
  });
};
const cancelEditTitle = () => {
  console.log("取消修改标题");
  showTitleInput.value = false;
};

// 图片、视频详情抽屉 -> 修改人员信息
// const drawerUserInfoOrigin = {
//   creator: { key: "creator", title: "创建人", isModifying: false, personId: null, personName: "", tempPersonId: null },
//   director: { key: "director", title: "编导", isModifying: false, personId: null, personName: "", tempPersonId: null },
//   camerist: { key: "camerist", title: "摄像", isModifying: false, personId: null, personName: "", tempPersonId: null },
//   editor: { key: "editor", title: "剪辑", isModifying: false, personId: null, personName: "", tempPersonId: null },
// };
const drawerUserInfo = ref<any>({
  creator: { key: "creator", title: "创建人", isModifying: false, personId: null, personName: "", tempPersonId: null },
  director: { key: "director", title: "编导", isModifying: false, personId: null, personName: "", tempPersonId: null },
  camerist: { key: "camerist", title: "摄像", isModifying: false, personId: null, personName: "", tempPersonId: null },
  editor: { key: "editor", title: "剪辑", isModifying: false, personId: null, personName: "", tempPersonId: null },
});
// const drawerUserInfo = reactive<any>({
//   creator: { key: "creator", title: "创建人", canNotModify: true, personId: null, personName: "", tempPersonId: null },
//   director: { key: "director", title: "编导", isModifying: false, personId: null, personName: "", tempPersonId: null },
//   camerist: { key: "camerist", title: "摄像", isModifying: false, personId: null, personName: "", tempPersonId: null },
//   editor: { key: "editor", title: "剪辑", isModifying: false, personId: null, personName: "", tempPersonId: null },
// });
// const drawerUserInfo = reactive<any>({
//   creator:  { key: "creator",  title: "创建人", canNotModify: true, personId: 11, personName: "张11", tempPersonId: null },
//   director: { key: "director", title: "编导", isModifying: false, personId: 22, personName: "李22", tempPersonId: null },
//   camerist: { key: "camerist", title: "摄像", isModifying: false, personId: 33, personName: "王33", tempPersonId: null },
//   editor:   { key: "editor",   title: "剪辑", isModifying: false, personId: null, personName: "", tempPersonId: null },
// });
const selectPerson = (user: any) => {
  console.log("select user", user, drawerUserInfo.value);
  user.isModifying = true;
  user.tempPersonId = user.personId;
};
const saveSelectPerson = (user: any) => {
  // console.log("保存已选人物", curProjCollabList.value);
  user.personId = user.tempPersonId;
  // console.log("find1", curProjCollabList.value, user.personId);
  let curProjCollab = curProjCollabList.value.find((p: any) => p.userId == user.personId);
  // console.log("find2", curProjCollab);
  user.personName = curProjCollab?.nickName;
  user.isModifying = false;
  let params = <any>{
    materialList: [drawerContent.value.materialId],
  };
  params[`${user.key}Id`] = user.personId;
  params[`${user.key}NickName`] = user.personName;

  postDistributeMaterialProducerApi(params).then((res) => {
    ElMessage.success("保存成功");
    search();
    getMaterialDetailsApi({ materialId: drawerContent.value?.materialId }).then((re) => {
      drawerContent.value = re.data;
    });
  });
  // console.log("find3", user);
  // originPerson = optionalPersons.value.find((p) => p.id === tempPersonId.value)!;
};
const cancleSelectPerson = (user: any) => {
  console.log("取消保存已选人物", curProjCollabList.value, drawerUserInfo);
  user.isModifying = false;
};

/**
 * 存储路径级联表单
 */
const pathDialogVisible = ref(false);
const cascaderPathOptions = ref<any>([]);
const cascaderPathArr = ref<number[]>([]); // 级联表单路径

const openPathDialog = () => {
  console.log("openPathDialog");
  cascaderPathArr.value = [null, drawerContent.value?.projectId];
  pathDialogVisible.value = true;
  getMaterialSidebarListApi().then((res) => {
    cascaderPathOptions.value = generateCasOptions(res.data);
    // 获取 indusId
    if (drawerContent.value?.materialShowPath) {
      let indusName = drawerContent.value.materialShowPath.split("/")[0];
      cascaderPathArr.value[0] = cascaderPathOptions.value.find((i: any) => i.label === indusName)?.value;
    }
  });
};
// 生成级联数据选项
const generateCasOptions = (originTree: any) => {
  return originTree.map((indus: any) => {
    let simpleIndus = <any>{
      label: indus.indusName,
      value: indus.indusId,
    };
    if (indus.projectList && indus.projectList.length) {
      simpleIndus.children = [];
      indus.projectList.forEach((p: any) => {
        let simpleProject = {
          label: p.projectName,
          value: p.projectId,
        };
        simpleIndus.children.push(simpleProject);
      });
    }
    return simpleIndus;
  });
};
const saveChangePath = () => {
  console.log("saveChangePath");
  console.log("originPath", cascaderPathArr.value);

  if (cascaderPathArr.value && cascaderPathArr.value[0]) {
    pathDialogVisible.value = false;
    let params = {
      materialId: drawerContent.value?.materialId,
      projId: cascaderPathArr.value[1],
    };
    postEditMaterialDetailsApi(params).then((res) => {
      ElMessage.success("同步素材储存路径选择成功");
      search();
      getMaterialDetailsApi({ materialId: drawerContent.value?.materialId }).then((re) => {
        drawerContent.value = re.data;
      });
    });
  } else {
    ElMessage.warning("未选择同步素材路径");
  }
};
const cancleChangePath = () => {
  console.log("cancleChangePath");
  pathDialogVisible.value = false;
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
    overflow-y: scroll;
    position: relative;
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
        padding: 12px 4px 0 12px;
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
    height: 320px;
    &-title {
      display: flex;
      box-sizing: border-box;
      padding-left: 16px;
      border-bottom: 1px solid #eeeeee;
      line-height: 40px;
      font-size: 16px;
    }
    &-content {
      overflow: hidden;
      box-sizing: border-box;
      // width: 200px;
      height: 280px;
      &-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 12px;
        line-height: 32px;
      }
    }
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
        object-fit: contain;
      }
    }
    &-material {
      // height: 150px;
      margin-bottom: 12px;
      .detail-content-info {
        display: flex;
        flex-wrap: wrap;
        div {
          flex-basis: 50%;
        }
      }
    }
    // &-teamworker {
    //   // height: 150px;
    // }
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
        flex-shrink: 0;
        width: 70px;
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
.main-color {
  color: var(--el-color-primary);
}
</style>
<style lang="scss">
// 不加 scoped, 用于覆盖 element-plus 样式
.libPathDialog {
  .el-dialog__header {
    padding: 0;
  }
}
</style>
