import qs from "qs";
import http from "@/api";
import { PORTBiz } from "@/api/config/servicePort";
import { Material } from "@/api/interface";

/**
 * @name 获取素材库侧边栏列表
 */
export const getMaterialSidebarListApi = () => {
  return http.get<Material.Indus[]>(PORTBiz + `/material/getMaterialSidebarList`);
};

/**
 * @name 获取项目详情
 * @param projId 必须，项目ID，number
 */
export const getProjectDetailsApi = (params: { projId: number }) => {
  return http.get<any>(PORTBiz + `/material/getProjectDetails?${qs.stringify(params)}`);
};

/**
 * @name 获取行业列表
 * @param nameL 非必须，行业名称模糊字段
 */
export const getIndustryListApi = (params?: { nameL: string }) => {
  return http.get<any>(PORTBiz + `/material/getIndustryList?${qs.stringify(params)}`);
};

/**
 * @name 获取协作者列表
 * @param deptIdList 非必须，行业名称模糊字段，多个数据逗号分隔，形如：{ deptIdList: "1,2" }
 */
export const getCollaboratorListApi = (params?: { deptIdList: string }) => {
  return http.get<any>(PORTBiz + `/material/getCollaboratorList?${qs.stringify(params)}`);
};

/**
 * @name 创建项目
 * @param projName 必须，项目名称
 * @param indusId 必须，行业ID，number
 * @param collabList 必须，协作者列表，number[]
 * @param projRemark 非必须，项目备注
 */
export const postCreateProjectApi = (params: any) => {
  return http.post<any>(PORTBiz + `/material/createProject`, params);
};

/**
 * @name 修改项目
 * @param projId 必须，项目ID，number
 * @param projName 非必须，项目名称
 * @param indusId 非必须，行业ID，number
 * @param collabList 非必须，协作者列表，number[]
 * @param projRemark 非必须，项目备注
 */
export const postUpdateProjectApi = (params: any) => {
  return http.post<any>(PORTBiz + `/material/updateProject`, params);
};

/**
 * @name 获取已添加的账户列表
 * @param appType 必须，应用类型，巨量引擎（头条）：1 巨量千川（千川）：2 磁力引擎（快手）：3 磁力金牛：4
 * @param pageNum 非必须，当前页，默认1，number
 * @param pageSize 非必须，每页数量，默认30，number
 * @param companyId 非必须，公司ID
 * @param accountNameOrId 非必须，账户名称模糊搜索
 */
export const getAdvertiserListAddedApi = (params: any) => {
  return http.get<any>(PORTBiz + `/advertiser/list/added?${qs.stringify(params)}`);
};

/**
 * @name 获取未添加的账户列表
 * @param appType 必须，应用类型，巨量引擎（头条）：1 巨量千川（千川）：2 磁力引擎（快手）：3 磁力金牛：4
 * @param pageNum 非必须，当前页，默认1，number
 * @param pageSize 非必须，每页数量，默认30，number
 * @param companyId 非必须，公司ID
 * @param accountNameOrId 非必须，账户名称模糊搜索
 */
export const getAdvertiserListUnaddedApi = (params: any) => {
  return http.get<any>(PORTBiz + `/advertiser/list/unadded?${qs.stringify(params)}`);
};

/**
 * @name 获取公司列表
 * @param pageNum 非必须，当前页，默认1，number
 * @param pageSize 非必须，每页数量，默认30，number
 */
export const getCompanyListApi = (params?: any) => {
  return http.get<any>(PORTBiz + `/company/list?${qs.stringify(params)}`);
};

/**
 * @name 获取外部平台授权地址
 * @param appType 必须，应用类型，巨量引擎（头条）：1 巨量千川（千川）：2 磁力引擎（快手）：3 磁力金牛：4
 */
export const getAuthUrlApi = (params: { appType: number }) => {
  return http.get<any>(PORTBiz + `/getAuthUrl?${qs.stringify(params)}`);
};

/**
 * @name 批量添加媒体账户
 * @param advertiserIds 必须，媒体账户id数组，number[]
 */
export const postAddAdvertiserApi = (params: any) => {
  return http.post<any>(PORTBiz + `/advertiser/update/addStatus`, params);
};

/**
 * @name 打开媒体账户素材开关
 * @param advertiserId 必须，媒体账户id
 * @param projectId 必须，项目id
 */
export const postOpenMaterialSyncApi = (params: any) => {
  return http.post<any>(PORTBiz + `/advertiser/materialSyncSwitch/open`, params);
};
/**
 * @name 关闭媒体账户素材开关
 * @param advertiserId 必须，媒体账户id
 */
export const postCloseAdvertiserApi = (params: { advertiserId: number }) => {
  return http.post<any>(PORTBiz + `/advertiser/materialSyncSwitch/close`, params);
};
