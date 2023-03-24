import http from "@/api";
import { PORTBiz } from "@/api/config/servicePort";


/**
 * @name 3.2.2.2 投放列表
 */
export const getRecordListApi = (params: any) => {
    return http.get<any>(PORTBiz + `/report/list`, params);
};
/**
 * @name 3.2.2.1 投放详情
 */
export const getRecordDetailApi = (params: any) => {
    return http.get<any>(PORTBiz + `/report/detail`, params);
};




