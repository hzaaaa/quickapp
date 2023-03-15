import qs from "qs";
import http from "@/api";
import { PORTAuth } from "../config/servicePort";

/**
 * @name 获取角色列表 list
 * @param nameL 非必须，角色名称模糊字段
 * @param pageNo 非必须，当前页，默认1，number
 * @param pageSize 非必须，每页数量，默认20，number
 */
export const getRoleListApi = (params?: any) => {
  // console.warn("获取角色列表");
  return http.get<any>(PORTAuth + `/role/list?${qs.stringify(params)}`);
};
/**
 * @name 获取角色列表 list

 */
export const getRoleListApi2 = (params?: any) => {
  // console.warn("获取角色列表");
  return http.get<any>(PORTAuth + `/role/management/getRoleList`);
};

/**
 * @name 获取角色信息 info
 * @param id 必须，角色id，number
 */
export const getRoleInfoApi = (params?: any) => {
  // console.warn("获取角色信息");
  return http.get<any>(PORTAuth + `/role/info?${qs.stringify(params)}`);
};

/**
 * @name 角色添加 add
 * @param name 必须，角色名称
 * @param dataScope 必须，操作部门范围，1-本级及下级，2-当前，number
 * @param menuIdList 必须，角色菜单数组，number[]
 * @param description 非必须，角色描述
 */
export const postRoleAddApi = (params: any) => {
  return http.post(PORTAuth + `/role/add`, params);
  // return http.post(PORTAuth + `/role/add`);
  // return http.post<Login.ResLogin>(PORT1 + `/role/add`, params, { headers: { noLoading: true } }); // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(PORT1 + `/role/add`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/role/add`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(PORT1 + `/role/add?${qs.stringify(params, { arrayFormat: "repeat" })}`); // 如果是 get 请求可以携带数组等复杂参数
};

/**
 * @name 角色修改 update
 * @param id 必须，角色id，number
 * @param name 非必须，角色名称
 * @param dataScope 非必须，操作部门范围，1-本级及下级，2-当前，number
 * @param menuIdList 非必须，角色菜单数组，number[]
 * @param description 非必须，角色描述
 */
export const postRoleUpdateApi = (params: any) => {
  return http.post(PORTAuth + `/role/update`, params);
};

/**
 * @name 角色删除 delete
 * @param id 必须，角色id，number
 */
export const postRoleDeleteApi = (params: any) => {
  return http.post(PORTAuth + `/role/delete`, params);
};
