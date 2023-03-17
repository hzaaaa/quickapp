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
              <el-option v-for="d in companyIdOptionalList" :key="d.id" :label="d.name" :value="d.id"></el-option>
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
              <el-option v-for="phone in phoneList" :key="phone" :label="phone" :value="phone"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="以下城市不投放" prop="excludeAdvertiseCityList">
            <el-cascader :options="options" :props="props" collapse-tags clearable></el-cascader>
          </el-form-item>


          <el-form-item label="投放时间设定">
            <div class="">

              <div class="" style="margin-top: 8px;">A. 常规时间选定：</div>
              <MSchedule @receive="onReceive" :curValue="curValue" />

              <div class="" style="margin-top: 8px;">B. 自定义投放时间:</div>
              <div class="date-list" v-for="(dateItem, index) in AppConfigForm.advertiseTimeBList">

                <el-date-picker v-model="dateItem.value1" type="datetime" placeholder="Select date and time" />
                至
                <el-date-picker style="margin-left: 20px;" v-model="dateItem.value2" type="datetime"
                  placeholder="Select date and time" />
                <el-icon color="#409EFC" @click="addDate" :size="20"
                  v-show="index === AppConfigForm.advertiseTimeBList.length - 1">
                  <CirclePlus />
                </el-icon>
                <el-icon color="red" @click="removeDate(index)" :size="20"
                  v-show="index !== (AppConfigForm.advertiseTimeBList.length - 1)">
                  <CircleClose />
                </el-icon>


              </div>
            </div>
          </el-form-item>

          <el-form-item label="是否启用的总开关" prop="enabled">
            <el-radio-group v-model="AppConfigForm.enabled" class="ml-4">
              <el-radio :label="true" size="large">启用</el-radio>
              <el-radio :label="false" size="large">停用</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input v-model="AppConfigForm.remark" :rows="5" type="textarea" placeholder="Please input" />

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
import { MSchedule } from '@bytedance-ad/mui-vue3';
import { useAppConfigStore } from "@/store/appConfig";
import { ArrowLeft } from "@element-plus/icons-vue";
import { onMounted, reactive, ref } from "vue";
import { getRoleListApi } from "@/api/system/role";
import { getDeptTreeApi } from "@/api/system/dept";
import { postCreateUserApi, postUpdateUserApi } from "@/api/system/User";
import { FormInstance, FormRules } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import {
  CirclePlus,
  CircleClose,
} from '@element-plus/icons-vue'

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
// const dateList = reactive([{
//   value1: '',
//   value2: '',
// }])
const addDate = () => {
  AppConfigForm.advertiseTimeBList.push({
    value1: '',
    value2: '',
  })
}
const removeDate = (index: number) => {
  AppConfigForm.advertiseTimeBList.splice(index, 1)
}

let curValue = ref({
  schedule_time: ""
})
const onReceive = (value: any) => {
  // 不能缺少这一步
  // debugger
  curValue.value = value;
  AppConfigForm.advertiseTimeA = value.schedule_time; //修改时记得传值
  console.log(AppConfigForm.advertiseTimeA)

};

const router = useRouter();
const route = useRoute();



const AppConfigFormRef = ref<FormInstance>();
const AppConfigForm = reactive({
  id: <number>-1,
  appName: <string>"",
  packageName: <string>"",
  companyId: <number | null>null,

  publishedBrand: <string>"",
  publishedBrandList: <any[]>[],
  activatedBrand: <string>"",
  activatedBrandList: <any[]>[],
  operatedBrand: <string>"",
  operatedBrandList: <any[]>[],

  mediaIdentityList: <any[]>[],
  excludeAdvertiseCityList: <any[]>[],

  advertiseTimeA: <string>'',
  advertiseTimeB: <string>'',
  advertiseTimeBList: <any[]>[],

  enabled: <boolean>false,
  remark: <string>'',

});
addDate();
const phoneList = ref<any>(['VIVO', 'OPPO', '小米', '华为']);
const companyIdOptionalList = ref<any>([]);

const validateappName = (rule: any, value: string, callback: any) => {
  // debugger
  if (AppConfigStore.behavior === "modify" && AppConfigStore.modifyAppConfigInfo.appName) return callback();

  if (!value) return callback(new Error("请输入快应用名称"));
  // debugger
  if (value.length > 20) callback(new Error("快应用名称不得超过20字"));
  else return callback();
};
const validatepackageName = (rule: any, value: any, callback: any) => {
  if (!value) return callback(new Error("请输入快应用包名"));
  if (value.length > 20) callback(new Error("快应用包名不得超过20字"));
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
  operatedBrandList: [{ validator: validateAppConfigParamArray1('启动运营的手机'), trigger: "change" }],
  mediaIdentityList: [{ validator: validateAppConfigParamArray2('关联的投放媒体标识'), trigger: "change" }],
  excludeAdvertiseCityList: [{ validator: validateAppConfigParamArray1('以下城市不投放'), trigger: "change" }],







});


getDeptTreeApi({ id: 8 }).then((res) => {
  companyIdOptionalList.value = res.data[0].childrenList;
});

const AppConfigStore = useAppConfigStore();
const cancleModifyAppConfig = () => {
  console.log("cancleModifyAppConfig", AppConfigForm);
  router.back();
};
const saveModifyAppConfig = async (formEl: FormInstance | undefined) => {
  console.log("saveModifyAppConfig", formEl);
  if (AppConfigStore.behavior !== "modify") {
    // 添加人员
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log("submit", AppConfigForm);
        // postCreateAppConfigApi(AppConfigForm).then((res) => {
        //   console.log("postCreateAppConfigApi", res);
        //   if (res.code === 200) {
        //     ElMessage.success("创建成功");
        //     router.push("/account/AppConfig");
        //   }
        // });
      } else {
        console.log("error", fields);
      }
    });
  } else {
    // 修改人员
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        let { ...otherAppConfigForm } = AppConfigForm; // eslint-disable-line
        let updateAppConfigParams = <any>{
          ...otherAppConfigForm,
          id: AppConfigStore.AppConfigInfoGet.id,

        };
        // if (password) updateAppConfigParams.password = password;
        postUpdateUserApi(updateAppConfigParams).then((res) => {
          if (res.code === 200) {
            ElMessage.success("修改成功");
            router.push("/account/AppConfig");
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
    const { appName, packageName, companyId } = AppConfigStore.modifyAppConfigInfo;
    if (appName) AppConfigForm.appName = appName;
    if (packageName) AppConfigForm.packageName = packageName;


    if (companyId) AppConfigForm.companyId = companyId;
  }
});

const back = () => {
  console.log("back");
  router.back();
};
</script>
  
<style scoped lang="scss">
.date-list {
  display: flex;
  align-items: center;
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
  