import http from "@/api";
import { PORTBiz } from "@/api/config/servicePort";

/**
 * @name 获取快应用配置列表
 */
export const getConfigListApi = (params: any) => {
  return http.get<any>(PORTBiz + `/config/getConfigList`, params);
};

/**
 * @name 获取配置列表详情
 * @param configId 当前激活配置的子 ID
 */
export const getConfigDetailsApi = (params: any) => {
  return http.post<any>(PORTBiz + `/config/getConfigDetails`, params);
};

/**
 * @name 加载公司主体下拉框
 */
export const getCompanySelectorsApi = (params: any) => {
  return http.get<any>(PORTBiz + `/config/getCompanySelectors`, params);
};
/**
 * @name 加载媒体标识下拉框
 */
export const getIdentitySelectorsApi = (params: any) => {
  return http.get<any>(PORTBiz + `/config/getIdentitySelectors`, params);
};
/**
 * @name 加载城市下拉框
 */
export const getCitySelectorsApi = (params: any) => {
  return http.get<any>(PORTBiz + `/config/getCitySelectors`, params);
};
