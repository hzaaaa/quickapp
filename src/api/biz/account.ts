import qs from "qs";
import http from "@/api";
import { PORTAuth } from "@/api/config/servicePort";
import { Account } from "@/api/interface";

/**
 * @name 获取媒体账户分配列表
 * @param userId 必须，用户ID，number
 */
export const getDistributionMediaAccountListApi = (params: { userId: number }) => {
  return http.get<Account.MediaAccount[]>(PORTAuth + `/media/getDistributionMediaAccountList?${qs.stringify(params)}`);
};

/**
 * @name 获取角色权限细节列表(一维)
 * @param roleId 必须，角色ID，number
 */
export const getRoleMenuDetailsByRoleId = (params: { roleId: number }) => {
  return http.get<Account.MediaAccount[]>(PORTAuth + `/user/management/selectRoleMenuDetailsByRoleId?${qs.stringify(params)}`);
};
