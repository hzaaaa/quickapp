import http from "@/api";
import { PORTBiz } from "@/api/config/servicePort";

/**
 * @name 获取素材报表列表
 * @param pageNum 必须，当前页，默认1，number
 * @param pageSize 必须，每页数量，默认30，number
 * @param timeDimensionType 必须，时间维度类型 1-数据时间; 2-创建时间
 * @param startTime 必须，查询开始时间, 需要和 endTime 搭配使用
 * @param endTime 必须，查询结束时间, 需要和 startTime 搭配使用
 * @param mediaCategory 非必须，媒体大类 1-头条; 2-百度; 3-广点通; 4-快手, number
 * @param advertiserId 非必须，来源账号 ID, number
 * @param collabType 非必须，协作人类型, 需要和 collabUserId 搭配使用 1-创建人; 2-编导; 3-摄像; 4-剪辑, number
 * @param collabUserId 非必须，协作人用户 ID, 需要和 collabType搭配使用, number
 * @param materialType 非必须，素材类型 1-图片; 2-视频, number
 * @param projId 非必须，项目 ID, number
 * @param filename 非必须，素材名称/ID
 */
export const postGetMaterialReportListApi = (params: any) => {
  return http.post<any>(PORTBiz + `/material/report/getMaterialReportList`, params);
};

/**
 * @name 导出素材报表列表
 * @param pageNum 必须，当前页，默认1，number
 * @param pageSize 必须，每页数量，默认30，number
 * @param timeDimensionType 必须，时间维度类型 1-数据时间; 2-创建时间
 * @param startTime 必须，查询开始时间, 需要和 endTime 搭配使用
 * @param endTime 必须，查询结束时间, 需要和 startTime 搭配使用
 * @param mediaCategory 非必须，媒体大类 1-头条; 2-百度; 3-广点通; 4-快手, number
 * @param advertiserId 非必须，来源账号 ID, number
 * @param collabType 非必须，协作人类型, 需要和 collabUserId 搭配使用 1-创建人; 2-编导; 3-摄像; 4-剪辑, number
 * @param collabUserId 非必须，协作人用户 ID, 需要和 collabType搭配使用, number
 * @param materialType 非必须，素材类型 1-图片; 2-视频, number
 * @param projId 非必须，项目 ID, number
 * @param filename 非必须，素材名称/ID
 * // 以 xlsx 格式下载时，必须添加 { responseType: "blob" } 配置项
 */
export const postExportMaterialReportApi = (params: any) => {
  return http.post<any>(PORTBiz + `/material/report/exportMaterialReport`, params, { responseType: "blob" });
};
