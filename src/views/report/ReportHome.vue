<template>
  <div class="report">
    <!-- 筛选维度区 -->
    <section class="filter">
      <el-row>
        <div class="filter-title">筛选维度</div>
      </el-row>
      <el-row>
        <el-button link type="primary" @click="clearQuery">清空</el-button>
        <el-button type="primary" @click="search">查询</el-button>
      </el-row>
      <el-row>
        <div class="filter-subtitle">媒体维度</div>
        <div class="filter-label">媒体</div>
        <el-select v-model="filterData.choosenMedia" placeholder="请选择">
          <el-option label="头条" :value="101"></el-option>
          <el-option label="快手" :value="102"></el-option>
        </el-select>
        <div class="filter-label">投放账号</div>
        <el-select v-model="filterData.choosenAccount" placeholder="请选择">
          <el-option label="头条账号" :value="161"></el-option>
          <el-option label="快手账号" :value="171"></el-option>
        </el-select>
      </el-row>
      <el-row>
        <div class="filter-subtitle">人员维度</div>
        <el-select v-model="filterData.choosenRole" placeholder="请选择">
          <el-option label="创建人" :value="201"></el-option>
          <el-option label="编导" :value="202"></el-option>
          <el-option label="剪辑" :value="203"></el-option>
          <el-option label="摄像" :value="204"></el-option>
        </el-select>
        <div class="filter-label">人员</div>
        <el-select v-model="filterData.choosenPerson" placeholder="请选择">
          <el-option label="全部" :value="299"></el-option>
          <el-option label="张三" :value="266"></el-option>
          <el-option label="李四" :value="277"></el-option>
          <el-option label="王五" :value="288"></el-option>
        </el-select>
      </el-row>
      <el-row>
        <div class="filter-subtitle">素材维度</div>
        <div class="filter-label">素材类型</div>
        <el-select v-model="filterData.choosenMaterialType">
          <el-option label="全部" :value="301"></el-option>
          <el-option label="视频" :value="302"></el-option>
          <el-option label="图片" :value="303"></el-option>
        </el-select>
        <div class="filter-label">项目</div>
        <el-select v-model="filterData.choosenProject">
          <el-option label="全部" :value="311"></el-option>
          <el-option label="军队文职" :value="366"></el-option>
          <el-option label="懒懒读书" :value="377"></el-option>
          <el-option label="启牛学堂" :value="388"></el-option>
        </el-select>
        <div class="filter-label">素材名称/ID</div>
        <el-input v-model="filterData.fuzzySearchName" :suffix-icon="Search"></el-input>
      </el-row>
      <el-row>
        <div class="filter-subtitle">时间维度</div>
        <el-select v-model="filterData.choosenDateType">
          <el-option label="数据时间" :value="401"></el-option>
          <el-option label="创建时间" :value="402"></el-option>
        </el-select>
        <el-config-provider :locale="zhCn">
          <el-date-picker v-model="filterData.choosenDateRange" type="daterange" range-separator="至" class="filter-datepicker" />
        </el-config-provider>
      </el-row>
    </section>
    <!-- 详细数据区 -->
    <section class="tableBox">
      <el-row>
        <div class="filter-title">详细数据</div>
      </el-row>
      <el-row>
        <!-- <el-button plain @click="consoleLog">导出报表</el-button> -->
        <el-button plain @click="exportReport">导出报表</el-button>
      </el-row>
      <el-table
        :data="tempTableData"
        class="table"
        :span-method="objectSpanMethod"
        :cell-style="setCellStyle"
        :header-cell-style="setCellStyle"
      >
        <!-- <el-table :data="tempTableData" class="table" :span-method="objectSpanMethod" :cell-class-name="cellClassName"> -->
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
        <el-table-column label="参与制作人" width="100">
          <template #default="scope">
            <div v-if="scope.row.creator">创建人：{{ scope.row.creator }}</div>
            <div v-if="scope.row.director">编导：{{ scope.row.director }}</div>
            <div v-if="scope.row.cameraMan">摄像：{{ scope.row.cameraMan }}</div>
            <div v-if="scope.row.editor">剪辑：{{ scope.row.editor }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="project" label="归属项目"></el-table-column>
        <el-table-column prop="media" label="媒体"></el-table-column>
        <el-table-column prop="plan" label="归属计划"></el-table-column>
        <el-table-column prop="dataTime" label="数据时间" width="160"></el-table-column>
        <el-table-column prop="consume" label="消耗"></el-table-column>
        <el-table-column prop="display" label="展示数"></el-table-column>
        <el-table-column prop="click" label="点击数"></el-table-column>
        <el-table-column prop="costThousand" label="平均千次展现费用"></el-table-column>
        <el-table-column prop="costPerClick" label="平均点击单价"></el-table-column>
        <el-table-column prop="clickRatio" label="点击率"></el-table-column>
        <el-table-column prop="transformNum" label="转化数"></el-table-column>
        <el-table-column prop="transformCost" label="转化成本"></el-table-column>
        <el-table-column prop="tranformRatio" label="转化率"></el-table-column>
        <el-table-column prop="displayTransRatio" label="展示转化率"></el-table-column>
        <el-table-column label="平均单次播放时长">
          <template #default="scope">
            <div v-if="scope.row.playDuration">{{ scope.row.playDuration }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="播放数">
          <template #default="scope">
            <div v-if="scope.row.playNum">{{ scope.row.playNum }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>

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
</template>

<script setup lang="ts">
import { Search, VideoPlay, EditPen } from "@element-plus/icons-vue";
import { TableColumnCtx } from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { onMounted, reactive, ref } from "vue";

/**
 * 筛选维度区
 */
const originFilterData = {
  choosenMedia: null,
  choosenAccount: null,
  choosenRole: 201,
  choosenPerson: 299,
  choosenMaterialType: 301,
  choosenProject: 311,
  fuzzySearchName: "",
  choosenDateType: 401,
  choosenDateRange: <Date[]>[],
};
const filterData = ref({
  choosenMedia: null,
  choosenAccount: null,
  choosenRole: 201,
  choosenPerson: 299,
  choosenMaterialType: 301,
  choosenProject: 311,
  fuzzySearchName: "",
  choosenDateType: 401,
  choosenDateRange: <Date[]>[],
});
const clearQuery = () => {
  console.log("清空条件");
  filterData.value = originFilterData;
  filterData.value.choosenDateRange = getThisMonthDateRangeArr();
};
const search = () => {
  console.log("查询素材");
  console.log("filterData", filterData.value);
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
onMounted(() => {
  filterData.value.choosenDateRange = getThisMonthDateRangeArr();
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
const exportReport = () => {
  console.log("导出报表");
  // 将需要导出的对象拼接为字符串
  let ExcelContent = `素材ID,素材名称,数据时间（首次产生）,素材类型,播放数`;
  tempTableData.forEach((m) => {
    ExcelContent += `\n${m.id},${m.name},${m.dataTime},${m.time ? "视频" : "图片"},${m.playNum ?? ""}`;
  });
  console.log("ExcelContent", ExcelContent);
  downloadByBlob("t.xls", ExcelContent);
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
// const consoleLog = () => {
//   console.log("spanArr", spanArr);
// };
// 合并单元格：方法
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
    const _row = spanArr[0][rowIndex];
    const _col = _row ? 1 : 0;
    return {
      rowspan: _row,
      colspan: _col,
    };
  }
  if (column.label === "媒体") {
    const _row = spanArr[1][rowIndex];
    const _col = _row ? 1 : 0;
    return {
      rowspan: _row,
      colspan: _col,
    };
  }
};
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
  a.href = URL.createObjectURL(new Blob(["\ufeff", content], { type: "application/octet-stream;charset=utf-8" }));
  // a.href = URL.createObjectURL(new Blob([content], { type: "application/octet-stream;charset=utf-8" }));
  // a.href = URL.createObjectURL(new Blob([content]));
  a.download = filename;
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
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
// 存储路径级联表单
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
// 报表页面整体布局
.report {
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
}
// 详细数据区
.tableBox {
  margin-top: 20px;
  // :deep(.cellName) {
  //   border-right: 1px solid #f2f2f2;
  // }
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
.el-row {
  align-items: center;
  height: 48px;
  & :deep(.el-input__wrapper) {
    flex-grow: 0;
  }
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
