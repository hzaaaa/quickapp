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
