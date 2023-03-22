<template>
  <div class="AppConfigModify">
    <el-container>
      <el-header>
        <el-icon class="back-icon pointer" @click="back">
          <ArrowLeft />
        </el-icon>
        <span> {{ AppConfigStore.behavior === "add" ? "新增" : "编辑" }}一个快应用的配置 </span>
      </el-header>
      <el-main>
        <el-form ref="AppConfigFormRef" :model="AppConfigForm" :rules="AppConfigFormRules" label-width="150px"
          label-position="right">
          <el-form-item label="快应用名称" prop="appName">

            <el-input :disabled="AppConfigStore.behavior === 'modify'" v-model="AppConfigForm.appName"
              placeholder="请输入快应用名称" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="快应用包名" prop="packageName">
            <el-input v-model="AppConfigForm.packageName" placeholder="请输入快应用包名" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="所属公司主体" prop="companyId">
            <el-select v-model="AppConfigForm.companyId" placeholder="请选择" style="width: 300px">
              <el-option v-for="d in companyOptionalList" :key="d.companyId" :label="d.companyName"
                :value="d.companyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="已上架手机" prop="publishedBrandList">
            <el-checkbox-group v-model="AppConfigForm.publishedBrandList">
              <el-checkbox :label="phone" v-for="phone in phoneList" :key="phone">{{ phone }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="已开通广告的手机" prop="activatedBrandList">
            <el-checkbox-group v-model="AppConfigForm.activatedBrandList">
              <el-checkbox :label="phone" v-for="phone in phoneList" :key="phone">{{ phone }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="启动运营的手机" prop="operatedBrandList">
            <el-checkbox-group v-model="AppConfigForm.operatedBrandList">
              <el-checkbox :label="phone" v-for="phone in phoneList" :key="phone">{{ phone }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="关联的投放媒体标识" prop="mediaIdentityList">
            <el-select multiple collapse-tags collapse-tags-tooltip v-model="AppConfigForm.mediaIdentityList"
              placeholder="请选择" style="width: 300px">
              <el-option v-for="item in identityOptionalList" :key="item.identityId" :label="item.mediaName"
                :value="item.identityId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="以下城市不投放" prop="excludeAdvertiseCityList">
            <!-- <el-cascader :options="cityOptionalList" :props="props" collapse-tags clearable></el-cascader> -->
          </el-form-item>


          <el-form-item label="投放时间设定">
            <div class="">

              <div class="" style="margin-top: 8px;">A. 常规时间选定：</div>
              <MSchedule v-if="MScheduleShow" @receive="onReceive" :curValue="curValue" />

              <div class="" style="margin-top: 8px;">B. 自定义投放时间:</div>
              <div class="date-input">

                <!-- <el-date-picker v-model="dateInput.value1" type="datetime" placeholder="" />
                至
                <el-date-picker style="margin-left: 20px;" v-model="dateInput.value2" type="datetime" placeholder="" /> -->
                <el-date-picker @change="addDate" v-model="dateInput" type="datetimerange" range-separator="To"
                  start-placeholder="开始时间" end-placeholder="结束时间" />
                <el-icon color="#409EFC" @click="addDate" :size="20">
                  <CirclePlus />
                </el-icon>



              </div>
              <div class="date-show">
                <div class="date-item" v-for="(dateItem, index) in AppConfigForm.advertiseTimeBList">
                  <div class="number" @click='editDate(index)'>
                    <div class="number1">
                      {{ dateItem[0] === null ? '' : moment(dateItem[0]).format('YYYY-MM-DD HH:mm:ss') }}
                    </div>
                    <div class="center">-</div>
                    <div class="number2">
                      {{ dateItem[1] === null ? '' : moment(dateItem[1]).format(`YYYY-MM-DD HH:mm:ss`) }}
                    </div>

                  </div>
                  <el-icon color="red" @click.stop="removeDate(index)" :size="20">
                    <CircleClose />
                  </el-icon>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="是否启用的总开关" prop="enabled">
            <el-radio-group v-model="AppConfigForm.enabled" class="ml-4">
              <el-radio :label="1" size="large">启用</el-radio>
              <el-radio :label="0" size="large">停用</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input v-model="AppConfigForm.remark" :rows="5" type="textarea" placeholder="请输入" />

          </el-form-item>

        </el-form>
        <el-row>
          <el-button @click="cancleModifyAppConfig">取消</el-button>
          <el-button type="primary" @click="saveModifyAppConfig(AppConfigFormRef)">确定</el-button>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
  
<script setup lang="ts">
import moment from 'moment';
import { MSchedule } from '@bytedance-ad/mui-vue3';
import { useAppConfigStore } from "@/store/appConfig";
import { ArrowLeft } from "@element-plus/icons-vue";
import { onMounted, reactive, ref, computed, watch, nextTick } from "vue";
import {
  getCompanySelectorsApi,
  getIdentitySelectorsApi,
  getCitySelectorsApi,
  editConfigApi,


} from "@/api/biz/appConfig";

import { FormInstance, FormRules } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import {
  CirclePlus,
  CircleClose,
} from '@element-plus/icons-vue'
// import { nextTick } from 'process';

//初始化
const router = useRouter();
const route = useRoute();

const AppConfigFormRef = ref<FormInstance>();
let AppConfigForm = reactive({
  configId: <number>-1,
  configPid: <number>-1,
  appName: <string>"",
  packageName: <string>"",
  companyId: <number | null>null,
  // companyId: <number | null>null,

  publishedBrand: <string>"",
  publishedBrandList: <any[]>[],
  activatedBrand: <string>"",
  activatedBrandList: <any[]>[],
  operatedBrand: <string>"",
  operatedBrandList: <any[]>[],



  advertiseTimeA: <string>'',
  advertiseTimeB: <string>'',
  advertiseTimeBList: <any[]>[],

  enabled: <number>0,//是否启用. 0-未启用; 1-已启用
  remark: <string>'',

  mediaIdentityList: <any[]>[],
  mediaIdentityIds: <string>'',
  excludeAdvertiseCityList: <any[]>[],
  excludeCityIds: <string>'',

});

const props = reactive({ multiple: true });
const options = reactive([{
  value: 1,
  label: '东南',
  children: [{
    value: 2,
    label: '上海',
    children: [
      { value: 3, label: '普陀' },
      { value: 4, label: '黄埔' },
      { value: 5, label: '徐汇' }
    ]
  }, {
    value: 7,
    label: '江苏',
    children: [
      { value: 8, label: '南京' },
      { value: 9, label: '苏州' },
      { value: 10, label: '无锡' }
    ]
  }, {
    value: 12,
    label: '浙江',
    children: [
      { value: 13, label: '杭州' },
      { value: 14, label: '宁波' },
      { value: 15, label: '嘉兴' }
    ]
  }]
}, {
  value: 17,
  label: '西北',
  children: [{
    value: 18,
    label: '陕西',
    children: [
      { value: 19, label: '西安' },
      { value: 20, label: '延安' }
    ]
  }, {
    value: 21,
    label: '新疆维吾尔族自治区',
    children: [
      { value: 22, label: '乌鲁木齐' },
      { value: 23, label: '克拉玛依' }
    ]
  }]
}])

const MScheduleShow = ref(false)


//时间B相关逻辑
let dateInput = ref(<any>null)
const addDate = () => {
  if (dateInput.value) {//点击编辑时有时间存在将其添加进列表中
    AppConfigForm.advertiseTimeBList.push(dateInput.value)
    dateInput = ref(<any>null)
  }
  // console.log(AppConfigForm.advertiseTimeBList);
  // AppConfigForm.advertiseTimeA = '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111000000000000000000000000000000000000001111111111000000000000000000000000000000000000001111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000';


}
const editDate = (index: number) => {
  //点击编辑时有时间存在将其添加进列表中
  addDate();
  dateInput.value = (AppConfigForm.advertiseTimeBList.splice(index, 1))[0];
}
const removeDate = (index: number) => {
  AppConfigForm.advertiseTimeBList.splice(index, 1)
}


//时间A相关逻辑
let curValue = ref({
  schedule_time: ""
})
// watch(
//   AppConfigForm,
//   (newValue, oldValue) => {
//     debugger
//     curValue.value.schedule_time = newValue.advertiseTimeA;
//     MScheduleShow.value = true;
//     // schedule_time: newValue

//   }, {
//   deep: true,

// })
const onReceive = (value: any) => {
  // 不能缺少这一步
  // debugger
  curValue.value = value;
  AppConfigForm.advertiseTimeA = value.schedule_time; //修改时记得传值
  console.log(AppConfigForm.advertiseTimeA)

};





const phoneList = ref<any>(['VIVO', 'OPPO', '小米', '华为']);
let companyOptionalList = ref<any>([]);
let identityOptionalList = ref<any>([]);
let cityOptionalList = ref<any>([]);



const validateappName = (rule: any, value: string, callback: any) => {
  // debugger
  if (AppConfigStore.behavior === "modify" && AppConfigStore.modifyAppConfigInfo.appName) return callback();

  if (!value) return callback(new Error("请输入快应用名称"));
  // debugger
  // if (value.length > 20) callback(new Error("快应用名称不得超过20字"));
  else return callback();
};
const validatepackageName = (rule: any, value: any, callback: any) => {
  if (!value) return callback(new Error("请输入快应用包名"));
  // if (value.length > 20) callback(new Error("快应用包名不得超过20字"));
  else return callback();
};
const validatecompanyId = (rule: any, value: any, callback: any) => {
  if (!value) return callback(new Error("请至少选择一个公司主体"));
  else return callback();
};

//校验数组可为[]
const validateAppConfigParamArray1 = (name: string) => {
  return (rule: any, value: any, callback: any) => {
    // if (!value || (Array.isArray(value) && !value.length)) return callback(new Error(`请至少选择一个${name}`));
    // else 
    return callback();
  };
}
//校验数组不可为[]
const validateAppConfigParamArray2 = (name: string) => {
  return (rule: any, value: any, callback: any) => {
    if (!value || (Array.isArray(value) && !value.length)) return callback(new Error(`请至少选择一个${name}`));
    else return callback();
  };
}

const AppConfigFormRules = reactive<FormRules>({
  appName: [{ validator: validateappName, trigger: "blur" }],
  packageName: [{ validator: validatepackageName, trigger: "blur" }],
  companyId: [{ validator: validatecompanyId, trigger: "change" }],

  publishedBrandList: [{ validator: validateAppConfigParamArray1('已上架手机'), trigger: "change" }],
  activatedBrandList: [{ validator: validateAppConfigParamArray1('已开通广告的手机'), trigger: "change" }],
  operatedBrandList: [{ validator: validateAppConfigParamArray2('启动运营的手机'), trigger: "change" }],
  mediaIdentityList: [{ validator: validateAppConfigParamArray2('关联的投放媒体标识'), trigger: "change" }],
  excludeAdvertiseCityList: [{ validator: validateAppConfigParamArray1('以下城市不投放'), trigger: "change" }],

});


getCompanySelectorsApi({}).then((res) => {
  companyOptionalList.value = res.data;
});
getIdentitySelectorsApi({}).then((res) => {
  identityOptionalList.value = res.data;
});
getCitySelectorsApi({}).then((res) => {
  cityOptionalList.value = res.data.list;
});

const AppConfigStore = useAppConfigStore();
const cancleModifyAppConfig = () => {
  console.log("cancleModifyAppConfig", AppConfigForm);
  router.back();
};

const beforeSubmit = () => {
  AppConfigForm.publishedBrand = AppConfigForm.publishedBrandList.toString();
  AppConfigForm.activatedBrand = AppConfigForm.activatedBrandList.toString();
  AppConfigForm.operatedBrand = AppConfigForm.operatedBrandList.toString();

  AppConfigForm.mediaIdentityIds = AppConfigForm.mediaIdentityList.toString();
  //城市
  // AppConfigForm.excludeCityIds = AppConfigForm.excludeAdvertiseCityList.toString();

  //timeB
  let strList = <string[]>[];
  AppConfigForm.advertiseTimeBList.forEach(item => {
    let str = '';
    if (item[0]) {
      str += moment(item[0]).valueOf()
    }
    str += '-';
    if (item[1]) {
      str += moment(item[1]).valueOf()
    }
    strList.push(str);
  });
  AppConfigForm.advertiseTimeB = strList.toString();



}
const saveModifyAppConfig = async (formEl: FormInstance | undefined) => {
  console.log("saveModifyAppConfig", formEl);
  if (AppConfigStore.behavior !== "modify") {
    // 添加配置
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log("submit", AppConfigForm);


        beforeSubmit();
        editConfigApi({
          action: 0,//新增
          ...AppConfigForm
        }).then((res) => {
          console.log("editConfigApi", res);
          if (res.code === 200) {
            ElMessage.success("创建成功");
            router.push("/configQuickApp");
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
        editConfigApi({
          action: 1,//编辑修改
          ...AppConfigForm
        }).then((res) => {
          if (res.code === 200) {
            ElMessage.success("修改成功");
            router.push("/configQuickApp");
          }
        });
      } else {
        console.log("error", fields);
      }
    });
  }
};

onMounted(() => {
  if (AppConfigStore.behavior === "modify") {
    // debugger
    AppConfigForm = Object.assign(AppConfigForm, AppConfigStore.modifyAppConfigInfo);
    curValue.value.schedule_time = AppConfigForm.advertiseTimeA;
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
.date-input {
  display: flex;
  align-items: center;
}

.date-show {
  margin-top: 5px;
  padding: 5px 0;
  height: 120px;
  border: 1px solid #f2f2f2;
  overflow: auto;

  .date-item {
    display: flex;
    align-items: center;

    .number {
      flex: 1;
      width: 0;
      display: flex;
      align-items: center;
      padding: 0 24px;

      .number1,
      .number2 {
        width: 41%;
        text-align: center;
      }

      .center {
        flex: 1;
        text-align: center;
      }
    }

    &:hover {
      background-color: #ecf5ff;
    }

    .el-icon {
      // margin-left: 5px;
    }
  }
}

.AppConfigModify {
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
  