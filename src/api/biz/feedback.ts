import http from "@/api";
import { PORTBiz } from "@/api/config/servicePort";


/**
 * @name 意见反馈列表
 */
export const getFeedbackListApi = (params: any) => {
    return http.get<any>(PORTBiz + `/feedback/list`, params);
};
/**
 * @name 获取意见反馈次数
 */
export const getFeedbackCountApi = (params: any) => {
    return http.get<any>(PORTBiz + `/feedback/count`, params);
};




