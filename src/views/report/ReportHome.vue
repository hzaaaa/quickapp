<template>
  <div class="report">
    <!-- 筛选维度区 -->
    <section class="filter">
      <!-- <el-row>
        <div class="filter-title">筛选维度</div>
      </el-row> -->
      <!-- <el-row>
        <el-button link type="primary" @click="clearQuery">清空</el-button>
        <el-button type="primary" @click="search">查询</el-button>
      </el-row> -->
      <el-row>
        <div class="filter-subtitle">媒体维度</div>
        <div class="filter-label">媒体</div>
        <el-select v-model="filterData.choosenMedia" placeholder="请选择">
          <el-option label="头条" :value="1"></el-option>
          <!-- <el-option label="百度" :value="2"></el-option>
          <el-option label="广点通" :value="3"></el-option> -->
          <el-option label="快手" :value="4"></el-option>
        </el-select>
        <div class="filter-label">投放账号</div>
        <el-select
          v-model="filterData.choosenAccount"
          placeholder="请选择"
          :disabled="!filterData.choosenMedia"
          @click="getAdveriserList"
        >
          <el-option
            v-for="ad in adList"
            :key="ad.advertiserId"
            :label="ad.remoteAdvertiserName"
            :value="ad.advertiserId"
          ></el-option>
        </el-select>
      </el-row>
      <el-row>
        <div class="filter-subtitle">人员维度</div>
        <el-select v-model="filterData.choosenRole" placeholder="请选择">
          <el-option label="创建人" :value="1"></el-option>
          <el-option label="编导" :value="2"></el-option>
          <el-option label="摄像" :value="3"></el-option>
          <el-option label="剪辑" :value="4"></el-option>
        </el-select>
        <div class="filter-label">人员</div>
        <el-select v-model="filterData.choosenPerson" placeholder="全部" @click="getPersonList">
          <el-option v-for="u in personList" :key="u.userId" :label="u.nickName" :value="u.userId"></el-option>
        </el-select>
      </el-row>
      <el-row>
        <div class="filter-subtitle">素材维度</div>
        <div class="filter-label">素材类型</div>
        <el-select v-model="filterData.choosenMaterialType" placeholder="全部">
          <el-option label="图片" :value="1"></el-option>
          <el-option label="视频" :value="2"></el-option>
        </el-select>
        <div class="filter-label">项目</div>
        <el-select v-model="filterData.choosenProject" placeholder="全部" @click="getProjectList">
          <el-option v-for="p in projectList" :key="p.projectId" :label="p.projectName" :value="p.projectId"></el-option>
        </el-select>
        <div class="filter-label">素材名称/ID</div>
        <el-input v-model="filterData.fuzzySearchName" :suffix-icon="Search" clearable></el-input>
      </el-row>
      <el-row>
        <div class="filter-subtitle">时间维度</div>
        <el-select v-model="filterData.choosenDateType">
          <el-option label="数据时间" :value="1"></el-option>
          <el-option label="创建时间" :value="2"></el-option>
        </el-select>
        <el-config-provider :locale="zhCn">
          <el-date-picker v-model="filterData.choosenDateRange" type="daterange" range-separator="至" class="filter-datepicker" />
        </el-config-provider>
        <el-button type="primary" @click="search" style="margin-left: 16px">查询</el-button>
        <el-button link type="primary" @click="clearQuery">清空</el-button>
      </el-row>
    </section>
    <!-- 详细数据区 -->
    <section class="tableBox">
      <el-row>
        <div class="filter-title">详细数据</div>
      </el-row>
      <el-row>
        <el-button plain v-check="[exportReport, ['report:export']]">导出报表</el-button>
      </el-row>
      <!-- :span-method="objectSpanMethod" -->
      <el-table
        :data="tableData"
        class="table"
        :cell-style="setCellStyle"
        :header-cell-style="setCellStyle"
        v-sticky="{ top: 0, parent: '.report' }"
      >
        <!-- <el-table :data="tempTableData" class="table" :span-method="objectSpanMethod" :cell-class-name="cellClassName"> -->
        <el-table-column label="素材" width="400">
          <template #default="scope">
            <div class="table-material">
              <div class="table-material-left" @click="openDrawer(scope.row)">
                <div class="table-material-left-box" v-if="scope.row.material && scope.row.material.materialType === 1">
                  <img :src="scope.row.material.materialPath" alt="" />
                  <!-- <img :src="getImage(scope.row.material)" alt="" /> -->
                </div>
                <div class="table-material-left-box" v-else>
                  <img :src="scope.row.material.materialPath" alt="" />
                  <!-- <video :src="getVideo(scope.row.material)"></video> -->
                  <!-- <video :src="scope.row.material.thumbPath"></video> -->
                  <el-icon class="icon" :size="40"><VideoPlay /></el-icon>
                </div>
              </div>
              <div class="table-material-right">
                <div>{{ scope.row.material.filename }}</div>
                <div v-if="scope.row.material && scope.row.material.materialType === 1">
                  大小：{{ formatSize(scope.row.material.size) }}
                </div>
                <div v-if="scope.row.material && scope.row.material.materialType === 2">
                  时长：{{ formatSecond(scope.row.material.duration) }}
                </div>
                <div>ID：{{ scope.row.material.remoteMaterialId }}</div>
                <div>创建时间：{{ scope.row.material.materialCreateTime }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="参与制作人" width="120">
          <template #default="scope">
            <div v-if="scope.row?.material?.materialAllocation?.creatorName">
              创建人：{{ scope.row.material.materialAllocation.creatorName }}
            </div>
            <div v-if="scope.row?.material?.materialAllocation?.directorName">
              编导：{{ scope.row.material.materialAllocation.directorName }}
            </div>
            <div v-if="scope.row?.material?.materialAllocation?.cameristName">
              摄像：{{ scope.row.material.materialAllocation.cameristName }}
            </div>
            <div v-if="scope.row?.material?.materialAllocation?.editorName">
              剪辑：{{ scope.row.material.materialAllocation.editorName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="material.project.projectName" label="归属项目"></el-table-column>
        <el-table-column prop="mediaCategory" label="媒体">
          <template #default="scope">
            <div v-if="scope.row.material.mediaCategory === 1">头条</div>
            <div v-if="scope.row.material.mediaCategory === 2">百度</div>
            <div v-if="scope.row.material.mediaCategory === 3">广点通</div>
            <div v-if="scope.row.material.mediaCategory === 4">快手</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="adName" label="归属计划"></el-table-column> -->
        <el-table-column width="160">
          <template #header>
            <div class="statementDate">
              <span>数据时间</span>
              <el-tooltip effect="light" :show-arrow="false">
                <el-icon size="small"><Warning /></el-icon>
                <template #content>
                  <div>
                    2023年3月前创建的素材，数据时间为系统抓取数据的时间；<br />2023年3月后创建的素材，数据时间为媒体平台首次产生消耗数据的时间
                  </div>
                </template>
              </el-tooltip>
            </div>
          </template>
          <template #default="scope">
            {{ scope.row.statementDate }}
          </template>
        </el-table-column>
        <el-table-column label="消耗">
          <template #default="scope">
            <div v-if="scope.row.cost">{{ scope.row.cost }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="展示数">
          <template #default="scope">
            <div v-if="scope.row.show">{{ scope.row.show }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="点击数">
          <template #default="scope">
            <div v-if="scope.row.click">{{ scope.row.click }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="avgShowCost" label="平均千次展现费用"></el-table-column>
        <el-table-column prop="avgClickCost" label="平均点击单价"></el-table-column> -->
        <el-table-column label="点击率">
          <template #default="scope">
            <div v-if="scope.row.ctr">{{ scope.row.ctr }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="转化数">
          <template #default="scope">
            <div v-if="scope.row.convert">{{ scope.row.convert }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column prop="convertCost" label="平均转化成本">
          <template #default="scope">
            <div v-if="scope.row.convertCost">{{ scope.row.convertCost }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="转化率">
          <template #default="scope">
            <div v-if="scope.row.convertRate">{{ scope.row.convertRate }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="展示转化率">
          <template #default="scope">
            <div v-if="scope.row.convertShowRate">{{ scope.row.convertShowRate }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="平均单次播放时长">
          <template #default="scope">
            <div v-if="scope.row.averagePlayTimePerPlay">{{ scope.row.averagePlayTimePerPlay }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="播放数">
          <template #default="scope">
            <div v-if="scope.row.totalPlay">{{ scope.row.totalPlay }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="深度转化成本">
          <template #default="scope">
            <div v-if="scope.row.deepConvertCost">{{ scope.row.deepConvertCost }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="深度转化率">
          <template #default="scope">
            <div v-if="scope.row.deepConvertRate">{{ scope.row.deepConvertRate }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="素材曝光数">
          <template #default="scope">
            <div v-if="scope.row.aclick">{{ scope.row.aclick }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="行为数">
          <template #default="scope">
            <div v-if="scope.row.bclick">{{ scope.row.bclick }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="平均千次封面曝光花费">
          <template #default="scope">
            <div v-if="scope.row.impression1kCost">{{ scope.row.impression1kCost }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="平均行为单价">
          <template #default="scope">
            <div v-if="scope.row.actionCost">{{ scope.row.actionCost }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="曝光数">
          <template #default="scope">
            <div v-if="scope.row.adShow">{{ scope.row.adShow }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="行为率">
          <template #default="scope">
            <div v-if="scope.row.actionRatio">{{ scope.row.actionRatio }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="直播观看3秒数">
          <template #default="scope">
            <div v-if="scope.row.livePlayed3s">{{ scope.row.livePlayed3s }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="直播间商品点击数">
          <template #default="scope">
            <div v-if="scope.row.liveEventGoodsView">{{ scope.row.liveEventGoodsView }}</div>
            <div v-else>--</div>
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
    </section>
  </div>

  <!-- 图片、视频详情抽屉 -->
  <!-- <el-drawer v-model="drawerOpen" direction="rtl" :show-close="false" size="40%" class="detail">
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
  </el-drawer> -->

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
              <video :src="drawerContent?.materialPath" controls preload="auto"></video>
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
  <!-- <el-dialog v-model="pathDialogVisible" :show-close="false" class="pathDialog reportPathDialog">
    <div class="pathDialog-title">
      <div class="pathDialog-title-left">行业分类</div>
      <div class="pathDialog-title-right">项目名称</div>
    </div>
    <el-cascader-panel :options="pathOptions" @change="handlePathChange" v-model="tempPathArr"></el-cascader-panel>
    <template #footer>
      <el-button @click="cancleChangePath">取消</el-button>
      <el-button type="primary" @click="saveChangePath">确定</el-button>
    </template>
  </el-dialog> -->

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
</template>

<script setup lang="ts">
import {
  getAdvertiserListSearchApi,
  getMaterialDetailsApi,
  getMaterialProducerApi,
  getMaterialSidebarListApi,
  getProjectCollabListApi,
  postDistributeMaterialProducerApi,
  postEditMaterialDetailsApi,
} from "@/api/biz/material";
import { postGetMaterialReportListApi, postExportMaterialReportApi } from "@/api/biz/report";
import { getUserSynopsisByDeptIdApi } from "@/api/system/user";
import { Search, VideoPlay, EditPen, Warning } from "@element-plus/icons-vue";
import { TableColumnCtx } from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { onMounted, reactive, ref, watch } from "vue";

/**
 * 筛选维度区
 */
const originFilterData = {
  choosenMedia: null,
  choosenAccount: null,
  choosenRole: 1,
  choosenPerson: "",
  choosenMaterialType: "",
  choosenProject: "",
  fuzzySearchName: "",
  choosenDateType: 1,
  choosenDateRange: <Date[]>[],
};
const filterData = ref({
  choosenMedia: null,
  choosenAccount: null,
  choosenRole: 1,
  choosenPerson: "",
  choosenMaterialType: "",
  choosenProject: "",
  fuzzySearchName: "",
  choosenDateType: 1,
  choosenDateRange: <Date[]>[],
});
const adList = ref<any[]>([]); // 来源账号列表，接口获取，v1版本只有头条来源的
const projectList = ref<any[]>([]); // 全部项目列表，接口获取
const personList = ref<any[]>([]); // 全部人员列表，接口获取
watch(
  () => filterData.value.choosenMedia,
  (newVal, oldVal) => {
    // console.log(oldVal, "->", newVal);
    filterData.value.choosenAccount = null;
    adList.value = [];
  }
);
// 获取来源账号列表，接口获取
const getAdveriserList = () => {
  console.log("getAdveriserList");
  if (filterData.value.choosenMedia) {
    if (!adList.value || !adList.value.length) {
      getAdvertiserListSearchApi({ appType: filterData.value.choosenMedia }).then((res) => {
        adList.value = res.data;
      });
    }
  }
};
// 获取全部项目列表，接口获取
const getProjectList = () => {
  if (!projectList.value || !projectList.value.length) {
    getMaterialSidebarListApi().then((res) => {
      projectList.value = res.data.reduce((total, cur) => {
        return total.concat(cur.projectList);
      }, <any>[]);
      // console.warn(projectList.value);
    });
  }
};
// 获取全部人员列表，接口获取
const getPersonList = () => {
  console.log("getPersonList", personList.value);
  if (!personList.value || !personList.value.length) {
    getUserSynopsisByDeptIdApi().then((res) => {
      personList.value = res.data;
    });
  }
};
const clearQuery = () => {
  console.log("清空条件");
  filterData.value = originFilterData;
  filterData.value.choosenDateRange = getThisMonthDateRangeArr();
};
const search = () => {
  if (!filterData.value.choosenDateRange || !filterData.value.choosenDateRange.length) {
    ElMessage.warning("请选择查询的时间范围");
    return;
  }
  let params = <any>{
    pageNum: 1,
    pageSize: 30,
    timeDimensionType: filterData.value.choosenDateType,
    startTime: formatDate(filterData.value.choosenDateRange[0]),
    endTime: formatDate(filterData.value.choosenDateRange[1]),
  };
  if (filterData.value.choosenMedia) params.mediaCategory = filterData.value.choosenMedia;
  if (filterData.value.choosenAccount) params.advertiserId = filterData.value.choosenAccount;
  if (filterData.value.choosenRole && filterData.value.choosenPerson) {
    params.collabType = filterData.value.choosenRole;
    params.collabUserId = filterData.value.choosenPerson;
  }
  if (filterData.value.choosenMaterialType) params.materialType = filterData.value.choosenMaterialType;
  if (filterData.value.choosenProject) params.projId = filterData.value.choosenProject;
  if (filterData.value.fuzzySearchName) params.filename = filterData.value.fuzzySearchName;
  postGetMaterialReportListApi(params).then((res) => {
    console.log("postGetMaterialReportListApi", res.data.list);
    tableData.value = res.data.list;
    pageParams.total = res.data.total;
  });
};
// **工具方法** 获取当月1号到目前日期的日期范围数组
const getThisMonthDateRangeArr = () => {
  let now = new Date();
  let curYear = now.getFullYear();
  let curMonth = now.getMonth() + 1;
  let startTime = new Date(`${curYear}-${curMonth}-01 00:00:00`);
  let endTime = now;
  return [startTime, endTime];
};
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
filterData.value.choosenDateRange = getThisMonthDateRangeArr();

let getMaterialReportInitParams = {
  pageNum: 1,
  pageSize: 30,
  timeDimensionType: filterData.value.choosenDateType,
  startTime: formatDate(filterData.value.choosenDateRange[0]),
  endTime: formatDate(filterData.value.choosenDateRange[1]),
};
postGetMaterialReportListApi(getMaterialReportInitParams).then((res) => {
  tableData.value = res.data.list;
  pageParams.total = res.data.total;
});

/**
 * 详细数据区
 */
interface Material {
  material: string;
  name: string;
  time?: string;
  size?: string;
  id: string;
  creatTime: string;
  creator: null | string;
  director: null | string;
  cameraMan: null | string;
  editor: null | string;
  project: string;
  media: string;
  plan: string;
  dataTime: string;
  consume: number;
  display: number;
  click: number;
  costThousand: number;
  costPerClick: number;
  clickRatio: string;
  transformNum: number;
  transformCost: number;
  tranformRatio: string;
  displayTransRatio: string;
  playDuration?: number;
  playNum?: number;
}
interface SpanMethodProps {
  row: Material;
  column: TableColumnCtx<Material>;
  rowIndex: number;
  columnIndex: number;
}
const tableData = ref<any[]>([]);
const tempTableData = [
  {
    material: "video.mp4",
    name: "video",
    time: "00:10",
    id: "1234456",
    creatTime: "2022-12-14 15:44:50",
    creator: "张三",
    director: "张三",
    cameraMan: "李四",
    editor: null,
    project: "军队文职",
    media: "头条",
    plan: "军队文职0103",
    dataTime: "2022-12-14 15:44:59",
    consume: 63.74,
    display: 303,
    click: 35,
    costThousand: 210.36,
    costPerClick: 1.82,
    clickRatio: "11.56%",
    transformNum: 0,
    transformCost: 0.0,
    tranformRatio: "0.00%",
    displayTransRatio: "0.00%",
    playDuration: 10.87,
    playNum: 289,
  },
  {
    material: "video.mp4",
    name: "video",
    time: "00:10",
    id: "1234457",
    creatTime: "2022-12-14 15:44:50",
    creator: "张三",
    director: "张三",
    cameraMan: "李四",
    editor: null,
    project: "军队文职",
    media: "头条",
    plan: "军队文职0104",
    dataTime: "2022-12-24 12:22:22",
    consume: 63.74,
    display: 103,
    click: 15,
    costThousand: 210.36,
    costPerClick: 1.82,
    clickRatio: "11.56%",
    transformNum: 0,
    transformCost: 0.0,
    tranformRatio: "0.00%",
    displayTransRatio: "0.00%",
    playDuration: 10.87,
    playNum: 289,
  },
  {
    material: "video.mp4",
    name: "video",
    time: "00:10",
    id: "1234458",
    creatTime: "2022-12-14 15:44:50",
    creator: "张三",
    director: "张三",
    cameraMan: "李四",
    editor: null,
    project: "军队文职",
    media: "快手",
    plan: "军队文职0119",
    dataTime: "2023-01-10 12:23:33",
    consume: 63.74,
    display: 13,
    click: 5,
    costThousand: 210.36,
    costPerClick: 1.82,
    clickRatio: "11.56%",
    transformNum: 0,
    transformCost: 0.0,
    tranformRatio: "0.00%",
    displayTransRatio: "0.00%",
    playDuration: 10.87,
    playNum: 289,
  },
  {
    material: "background.webp",
    name: "图片名",
    size: "3M",
    id: "1218956",
    creatTime: "2022-12-14 15:12:50",
    creator: "李四",
    director: "张三",
    cameraMan: "李四",
    editor: "王五",
    project: "懒懒听书",
    media: "快手",
    plan: "懒懒听书0107",
    dataTime: "2022-12-14 15:28:25",
    consume: 12.34,
    display: 3021,
    click: 359,
    costThousand: 120.36,
    costPerClick: 1.12,
    clickRatio: "21.63%",
    transformNum: 0,
    transformCost: 0.0,
    tranformRatio: "0.00%",
    displayTransRatio: "0.00%",
  },
  {
    material: "video.mp4",
    name: "video",
    time: "00:10",
    id: "1234459",
    creatTime: "2022-12-14 15:44:50",
    creator: "张三",
    director: "张三",
    cameraMan: "李四",
    editor: null,
    project: "军队文职",
    media: "头条",
    plan: "军队文职0104",
    dataTime: "2022-12-14 15:44:59",
    consume: 63.74,
    display: 303,
    click: 35,
    costThousand: 210.36,
    costPerClick: 1.82,
    clickRatio: "11.56%",
    transformNum: 0,
    transformCost: 0.0,
    tranformRatio: "0.00%",
    displayTransRatio: "0.00%",
    playDuration: 10.87,
    playNum: 289,
  },
];
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
const exportReport = () => {
  let tiamRange = filterData.value.choosenDateRange[1].getTime() - filterData.value.choosenDateRange[0].getTime();
  if (tiamRange > 90 * 86400 * 1000) {
    ElMessage.warning("只能导出三个月内的数据");
    return;
  }
  let params = <any>{
    pageNum: pageParams.pageNum,
    pageSize: pageParams.pageSize,
    timeDimensionType: filterData.value.choosenDateType,
    startTime: formatDate(filterData.value.choosenDateRange[0]),
    endTime: formatDate(filterData.value.choosenDateRange[1]),
  };
  if (filterData.value.choosenMedia) params.mediaCategory = filterData.value.choosenMedia;
  if (filterData.value.choosenAccount) params.advertiserId = filterData.value.choosenAccount;
  if (filterData.value.choosenRole && filterData.value.choosenPerson) {
    params.collabType = filterData.value.choosenRole;
    params.collabUserId = filterData.value.choosenPerson;
  }
  if (filterData.value.choosenMaterialType) params.materialType = filterData.value.choosenMaterialType;
  if (filterData.value.choosenProject) params.projId = filterData.value.choosenProject;
  if (filterData.value.fuzzySearchName) params.filename = filterData.value.fuzzySearchName;
  postExportMaterialReportApi(params).then((res) => {
    // @ts-ignore
    let fileName = res.headers.get("content-disposition").split("filename=")[1];
    console.log("postExportMaterialReportApi", fileName);
    downloadByBlob(fileName, res.data);
  });
  // // 将需要导出的对象拼接为字符串
  // let ExcelContent = `素材ID,素材名称,数据时间（首次产生）,素材类型,播放数`;
  // tempTableData.forEach((m) => {
  //   ExcelContent += `\n${m.id},${m.name},${m.dataTime},${m.time ? "视频" : "图片"},${m.playNum ?? ""}`;
  // });
  // console.log("ExcelContent", ExcelContent);
  // downloadByBlob("t.xls", ExcelContent);
};
const spanArr = reactive<number[][]>([[], []]); // 合并单元格：控制合并的数组
const pos = ref(0); // 合并单元格：spanArr 数组索引
// 合并单元格：spanArr 处理
tempTableData.reduce(
  (total, cur, i) => {
    if (i === 0) {
      spanArr[0].push(1);
      spanArr[1].push(1);
    } else {
      if (cur.name === total.name) {
        spanArr[0][pos.value] += 1;
        spanArr[0].push(0);
        if (cur.media === total.media) {
          spanArr[1][pos.value] += 1;
          spanArr[1].push(0);
        } else {
          spanArr[1].push(1);
        }
      } else {
        spanArr[0].push(1);
        spanArr[1].push(1);
        pos.value = i;
      }
    }
    return cur;
  },
  { name: "", media: "" }
);
// 合并单元格：方法
// const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
//   if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
//     const _row = spanArr[0][rowIndex];
//     const _col = _row ? 1 : 0;
//     return {
//       rowspan: _row,
//       colspan: _col,
//     };
//   }
//   if (column.label === "媒体") {
//     const _row = spanArr[1][rowIndex];
//     const _col = _row ? 1 : 0;
//     return {
//       rowspan: _row,
//       colspan: _col,
//     };
//   }
// };
const setCellStyle = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
  if (column.label === "素材") {
    // style 只能返回对象形式，返回 string 形式会报错
    return { borderRight: "solid 1px #f2f2f2" };
  } else {
    return "";
  }
};
// const cellClassName = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
//   if (column.label === "素材") {
//     return "cellName";
//   } else {
//     return "";
//   }
// };
// **工具方法** 通用下载
const downloadByBlob = (filename: string, content: any) => {
  let a = document.createElement("a");
  //解决微软系产品 bom 头引起的中文乱码问题
  // a.href = URL.createObjectURL(new Blob(["\ufeff", content]));
  a.href = URL.createObjectURL(
    new Blob([content], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" })
  );
  // a.href = URL.createObjectURL(new Blob(["\ufeff", content], { type: "application/octet-stream;charset=utf-8" }));
  // a.href = window.URL.createObjectURL(new Blob([content], { type: "application/octet-stream;charset=UTF-8" }));
  // a.href = URL.createObjectURL(new Blob([content]));
  a.download = filename;
  a.click();
  a.remove();
  window.URL.revokeObjectURL(a.href);
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
  console.log("handlePageChange", pageNum);
  let params = <any>{
    pageNum: pageNum,
    pageSize: pageParams.pageSize,
    timeDimensionType: filterData.value.choosenDateType,
    startTime: formatDate(filterData.value.choosenDateRange[0]),
    endTime: formatDate(filterData.value.choosenDateRange[1]),
  };
  if (filterData.value.choosenMedia) params.mediaCategory = filterData.value.choosenMedia;
  if (filterData.value.choosenAccount) params.advertiserId = filterData.value.choosenAccount;
  if (filterData.value.choosenRole && filterData.value.choosenPerson) {
    params.collabType = filterData.value.choosenRole;
    params.collabUserId = filterData.value.choosenPerson;
  }
  if (filterData.value.choosenMaterialType) params.materialType = filterData.value.choosenMaterialType;
  if (filterData.value.choosenProject) params.projId = filterData.value.choosenProject;
  if (filterData.value.fuzzySearchName) params.filename = filterData.value.fuzzySearchName;
  postGetMaterialReportListApi(params).then((res) => {
    console.log("postGetMaterialReportListApi", res.data.list);
    tableData.value = res.data.list;
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
  getMaterialDetailsApi({ materialId: material.material.materialId }).then((res) => {
    drawerContent.value = res.data;
  });
  getMaterialProducerApi({ materialId: material.material.materialId }).then((res) => {
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
    getProjectCollabListApi({ projId: material.material.projectId }).then((res) => {
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
// let originPerson = optionalPersons.value.find((p) => p.id === 3)!;
// const tempPersonId = ref(0);
// const showPersonSelect = ref(false);
const curProjCollabList = ref<any[]>([]); // 当前项目的协作者列表
const selectPerson = (user: any) => {
  console.log("select user", user);
  user.isModifying = true;
  user.tempPersonId = user.personId;
  if (!curProjCollabList.value || !curProjCollabList.value.length) {
    getProjectCollabListApi({ projId: drawerContent.value.projectId }).then((res) => {
      curProjCollabList.value = res.data;
    });
  }
};
const saveSelectPerson = (user: any) => {
  user.personId = user.tempPersonId;
  // console.log("find1", curProjCollabList.value, user.personId);
  let curProjCollab = curProjCollabList.value.find((p: any) => p.userId == user.personId);
  // console.log("find2", curProjCollab);
  user.personName = curProjCollab?.nickName;
  user.isModifying = false;
  let params = <any>{
    // projId: drawerContent.value.projectId,
    materialList: [drawerContent.value.materialId],
  };
  params[`${user.key}Id`] = user.personId;
  params[`${user.key}NickName`] = user.personName;

  postDistributeMaterialProducerApi(params).then((res) => {
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
// const selectPerson = () => {
//   showPersonSelect.value = true;
//   tempPersonId.value = originPerson?.id;
// };
// const saveSelectPerson = () => {
//   console.log("保存已选人物");
//   showPersonSelect.value = false;
//   originPerson = optionalPersons.value.find((p) => p.id === tempPersonId.value)!;
// };
// const cancleSelectPerson = () => {
//   console.log("取消保存已选人物");
//   showPersonSelect.value = false;
// };

// 存储路径级联表单
// const pathOptions = [
//   {
//     value: "教育培训",
//     label: "教育培训",
//     children: [{ value: "军队文职", label: "军队文职" }],
//   },
//   {
//     value: "汽车",
//     label: "汽车",
//     children: [{ value: "汽车介绍", label: "汽车介绍" }],
//   },
//   {
//     value: "书籍应用",
//     label: "书籍应用",
//     children: [
//       { value: "懒懒听书", label: "懒懒听书" },
//       { value: "书路阅读", label: "书路阅读" },
//     ],
//   },
// ];
// const pathDialogVisible = ref(false);
// const tempPathArr = ref<string[]>([]);
// const originalPathStr = ref("教育培训/军队文职");
// const openPathDialog = () => {
//   console.log("openPathDialog");
//   tempPathArr.value = originalPathStr.value.split("/");
//   pathDialogVisible.value = true;
// };
// const saveChangePath = () => {
//   console.log("saveChangePath");
//   pathDialogVisible.value = false;
//   console.log("originPath", originalPathStr.value);
//   console.log("tempPath", tempPathArr.value);
//   originalPathStr.value = tempPathArr.value.join("/");
// };
// const cancleChangePath = () => {
//   console.log("cancleChangePath");
//   pathDialogVisible.value = false;
// };
// const handlePathChange = (val: any) => {
//   console.log("pathChange", val);
// };

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
// 报表页面整体布局
.report {
  overflow-y: auto;
  position: relative;
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
  height: 100%;
  font-size: 14px;
}
// 筛选维度区
.filter {
  padding-bottom: 20px;
  border-bottom: 1px solid #f2f2f2;
  &-title {
    font-weight: 700;
    font-size: 16px;
  }
  &-subtitle {
    margin-right: 20px;
    font-weight: 700;
    // & + .filter-label {
    //   margin-left: 0;
    // }
  }
  &-label {
    margin-right: 8px;
    // &:nth-child(2) {
    //   margin-left: 0;
    // }
  }
  & .el-row {
    align-items: center;
    height: 48px;
    & :deep(.el-input__wrapper) {
      flex-grow: 0;
    }
  }
}
// 详细数据区
.tableBox {
  margin-top: 20px;
  // :deep(.cellName) {
  //   border-right: 1px solid #f2f2f2;
  // }
  & .el-row {
    align-items: center;
    height: 48px;
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
      flex-shrink: 0;
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
  .statementDate {
    display: flex;
    align-items: center;
    span {
      margin-right: 4px;
    }
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
    // &-input {
    //   flex-grow: 1;
    // }
  }
  &-content {
    &-preview {
      margin-bottom: 32px;
      width: 100%;
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
    //   height: 150px;
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
// .el-row {
//   align-items: center;
//   height: 48px;
//   & :deep(.el-input__wrapper) {
//     flex-grow: 0;
//   }
// }
.main-color {
  color: var(--el-color-primary);
}
.el-select {
  margin-right: 12px;
}
.el-input {
  width: auto;
}
// .el-input__wrapper {
//   flex-grow: 0;
// }
</style>
