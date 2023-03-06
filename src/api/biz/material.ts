import qs from "qs";
import http from "@/api";
import { PORTAuth, PORTBiz } from "@/api/config/servicePort";
import { Material } from "@/api/interface";

/**
 * @name 获取素材库侧边栏列表
 * @param projName 非必须，项目名称，用于模糊搜索
 */
export const getMaterialSidebarListApi = (params?: { projName: string }) => {
  return http.get<Material.Indus[]>(PORTBiz + `/material/getMaterialSidebarList?${qs.stringify(params)}`);
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
 * @param deptIdList 非必须，部门 ID List，多个数据逗号分隔，形如：{ deptIdList: "1,2" }
 */
export const getCollaboratorListApi = (params?: { deptIdList: string }) => {
  return http.get<any>(PORTAuth + `/material/getCollaboratorList?${qs.stringify(params)}`);
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
 * @name 获取素材列表
 * @param projId 必须，项目ID，number
 * @param mediaCategory 必须，应用类型，1-头条; 2-百度; 3-广点通; 4-快手
 * @param pageNum 必须，当前页，默认1，number
 * @param pageSize 必须，每页数量，默认30，number
 * @param materialCreateStartTime 非必须，素材创建开始时间，形如 "2023-02-10"
 * @param materialCreateEndTime 非必须，素材创建结束时间，形如 "2023-02-20"
 * @param advertiserId 非必须，来源账号 ID，number
 * @param filename 非必须，素材名称/ID
 * @param collabType 非必须，协作人类型, 需要和 collabUserId 搭配使用 1-创建人; 2-编导; 3-摄像; 4-剪辑，number
 * @param collabUserId 非必须，协作人用户 ID, 需要和 collabType搭配使用，number
 * @param materialType 非必须，素材类型 1-图片; 2-视频，number
 */
export const postGetMaterialListApi = (params: any) => {
  return http.post<any>(PORTBiz + `/material/getMaterialList`, params);
};

/**
 * @name 获取指定素材的制作人信息
 * @param materialId 必须，素材 ID，number
 */
export const getMaterialProducerApi = (params: { materialId: number }) => {
  return http.get<any>(PORTBiz + `/material/getMaterialProducer?${qs.stringify(params)}`);
};

/**
 * @name 获取项目的协作人列表
 * @param projId 必须，项目 ID，number
 */
export const getProjectCollabListApi = (params: { projId: number }) => {
  return http.get<any>(PORTBiz + `/material/getProjectCollabList?${qs.stringify(params)}`);
};

/**
 * @name 分配素材制作人
 * @param materialList 必须，素材 ID 列表，number[]
 * @param creatorId 非必须，创建人 ID，number
 * @param creatorNickName 非必须，创建人昵称
 * @param directorId 非必须，编导 ID，number
 * @param directorNickName 非必须，编导昵称
 * @param cameristId 非必须，摄像 ID，number
 * @param cameristNickName 非必须，摄像昵称
 * @param editorId 非必须，剪辑 ID，number
 * @param editorNickName 非必须，剪辑昵称
 */
export const postDistributeMaterialProducerApi = (params: any) => {
  return http.post<any>(PORTBiz + `/material/distributeMaterialProducer`, params);
};

/**
 * @name 获取指定素材的素材详情(素材信息)
 * @param materialId 必须，素材 ID，number
 */
export const getMaterialDetailsApi = (params: { materialId: number }) => {
  return http.get<any>(PORTBiz + `/material/getMaterialDetails?${qs.stringify(params)}`);
};

/**
 * @name 修改指定素材的素材详情(素材信息)
 * @param materialId 必须，素材 ID，number
 * @param filename 非必须，文件名
 * @param projId 非必须，新项目 ID, number
 */
export const postEditMaterialDetailsApi = (params: any) => {
  return http.post<any>(PORTBiz + `/material/editMaterialDetails`, params);
};

// ========== 以下为 账户->媒体投放账户 的接口 ==========
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
 * @name 获取已添加的账户列表(搜索用)
 * @param appType 必须，应用类型，巨量引擎（头条）：1 巨量千川（千川）：2 磁力引擎（快手）：3 磁力金牛：4
 * @param projectId 非必须，项目ID
 */
export const getAdvertiserListSearchApi = (params: any) => {
  return http.get<any>(PORTBiz + `/advertiser/list/search?${qs.stringify(params)}`);
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
