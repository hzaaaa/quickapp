import http from "@/api";
import { PORTBiz } from "@/api/config/servicePort";


/**
 * @name 获取媒体标识列表
 */
export const getIdentityListApi = (params: any) => {
    return http.get<any>(PORTBiz + `/identity/getIdentityList`, params);
};

/**
 * @name 获取配置列表详情
 * 
 */
export const getIdentityDetailsApi = (params: any) => {
    // debugger
    return http.get<any>(PORTBiz + `/identity/getIdentityDetails`, params);
};


/**
 * @name 新增/编辑标识
 */
export const editIdentityApi = (params: any) => {
    return http.post<any>(PORTBiz + `/identity/editIdentity`, params);
};
/**
 * @name 删除配置
 */
export const deleteIdentityApi = (params: any) => {
    return http.post<any>(PORTBiz + `/identity/deleteIdentity`, params);
};

