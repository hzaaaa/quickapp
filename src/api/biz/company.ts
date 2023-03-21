import http from "@/api";
import { PORTBiz } from "@/api/config/servicePort";


/**
 * @name 获取运营主体列表
 */
export const getCompanyListApi = (params: any) => {
    return http.get<any>(PORTBiz + `/company/getCompanyList`, params);
};

/**
 * @name 获取运营主体详情
 * 
 */
export const getCompanyDetailsApi = (params: any) => {
    // debugger
    return http.get<any>(PORTBiz + `/company/getCompanyDetails`, params);
};


/**
 * @name 新增/编辑标识
 */
export const editCompanyApi = (params: any) => {
    return http.post<any>(PORTBiz + `/company/editCompany`, params);
};


