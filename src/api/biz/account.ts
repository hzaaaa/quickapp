import qs from "qs";
import http from "@/api";
import { PORTAuth, PORTBiz } from "@/api/config/servicePort";
// import { Account } from "@/api/interface";

/**
 * @name 获取媒体账户分配列表
 * @param userId 必须，用户ID，number
 * @param pageNum 必须，当前页，默认1，number
 * @param pageSize 必须，每页数量，默认50，number
 */
export const getDistributionMediaAccountListByUserIdApi = (params: { userId: number; pageNum: number; pageSize: number }) => {
  return http.get<any>(PORTBiz + `/media/getDistributionMediaAccountListByUserId?${qs.stringify(params)}`);
};

/**
 * @name 获取角色权限细节列表(一维)
 * @param roleId 必须，角色ID，number
 */
export const getRoleMenuDetailsByRoleId = (params: { roleId: number }) => {
  return http.get(PORTAuth + `/user/management/selectRoleMenuDetailsByRoleId?${qs.stringify(params)}`);
};

/**
 * @name 获取媒体大类列表
 */
export const getMediaCategoryListApi = () => {
  return http.get<any>(PORTBiz + `/media/getMediaCategoryList`);
};

/**
 * @name 获取媒体公司列表
 */
export const getCompanyListApi = () => {
  return http.get(PORTBiz + `/media/getCompanyList`);
};

/**
 * @name 获取指定用户的未绑定媒体列表
 * @param userId 必须，用户ID，number
 * @param mediaCategory 必须，媒体大类代号，number
 * @param companyId 非必须，公司ID，number
 * @param pageNum 非必须，当前页，默认1，number
 * @param pageSize 非必须，每页数量，默认50，number
 */
export const postDistributionMediaAccountListByFormApi = (params: any) => {
  return http.post<any>(PORTBiz + `/media/getDistributionMediaAccountListByForm`, params);
};

/**
 * @name 分配媒体账号给指定用户
 * @param userId 必须，用户ID，number
 * @param advertiserList 必须，媒体列表，number[]
 */
export const postDistributeMediaAccountListApi = (params: any) => {
  return http.post(PORTBiz + `/media/distributeMediaAccountList`, params);
};

/**
 * @name 删除指定账户的媒体账号
 * @param userId 必须，用户ID，number
 * @param advertiserList 必须，媒体列表，number[]
 */
export const postDeleteDistributionMediaAccountListApi = (params: any) => {
  return http.post(PORTBiz + `/media/deleteDistributionMediaAccountList`, params);
};
