import qs from "qs";
import http from "@/api";
import { PORTAuth } from "../config/servicePort";

/**
 * @name 获取用户列表 list
 * @param userName 非必须，用户姓名
 * @param nickName 非必须，用户昵称
 * @param phone 非必须，手机号
 * @param enable 非必须，是否启用，0-禁用，1启用，number
 * @param deptId 非必须，部门id数组，number[]
 * @param roleId 非必须，角色id数组，number[]
 * @param pageNum 非必须，当前页，默认1，number
 * @param pageSize 非必须，每页数量，默认20，number
 */
export const getUserListApi = (params?: any) => {
  // console.warn("获取用户列表");
  return http.get<any>(PORTAuth + `/user/list?${qs.stringify(params)}`);
};

/**
 * @name 获取用户信息 info
 * @param userId 非必须，用户id，默认当前用户id，number
 */
export const getUserInfoApi = (params?: any) => {
  // console.warn("获取用户信息");
  return http.get<any>(PORTAuth + `/user/info?${qs.stringify(params)}`);
};

/**
 * @name 用户添加 add
 * @param username 必须，用户名
 * @param phone 必须，手机号
 * @param password 必须，用户密码
 * @param deptId 必须，部门id，number
 * @param nickName 非必须，用户昵称
 * @param email 非必须，用户邮箱
 * @param avatarUrl 非必须，用户头像url
 * @param roleIdList 非必须，角色id数组，number[]
 * @param gender 非必须，性别，0-女，1-男, number
 * @param enable 非必须，是否启用，0-禁用，1启用, number
 */
export const postUserAddApi = (params: any) => {
  return http.post(PORTAuth + `/user/add`, params);
  // return http.post(PORTAuth + `/user/add`);
  // return http.post<Login.ResLogin>(PORT1 + `/user/add`, params, { headers: { noLoading: true } }); // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(PORT1 + `/user/add`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/user/add`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(PORT1 + `/user/add?${qs.stringify(params, { arrayFormat: "repeat" })}`); // 如果是 get 请求可以携带数组等复杂参数
};

/**
 * @name 用户修改 update
 * @param id 必须，用户id，number
 * @param username 非必须，用户名
 * @param phone 非必须，手机号
 * @param password 非必须，用户密码
 * @param deptId 非必须，部门id，number
 * @param nickName 非必须，用户昵称
 * @param email 非必须，用户邮箱
 * @param avatarUrl 非必须，用户头像url
 * @param roleIdList 非必须，角色id数组，number[]
 * @param gender 非必须，性别，0-女，1-男, number
 * @param enable 非必须，是否启用，0-禁用，1启用, number
 */
export const postUserUpdateApi = (params: any) => {
  return http.post(PORTAuth + `/user/update`, params);
};

/**
 * @name 用户删除 delete
 * @param id 必须，用户id，number
 */
export const postUserDeleteApi = (params: any) => {
  return http.post(PORTAuth + `/user/delete`, params);
};

/**
 * @name 用户修改密码 password update
 * @param oldPassword 必须，用户旧密码
 * @param newPassword 必须，用户新密码
 */
export const postUserPasswordUpdateApi = (params: any) => {
  return http.post(PORTAuth + `/user/password/update`, params);
};

/**
 * @name 管理员重置用户密码 reset
 * @param id 必须，用户id，number
 */
export const postUserPasswordResetApi = (params: any) => {
  return http.post(PORTAuth + `/user/password/reset`, params);
};

/**
 * @name 获取指定部门人员列表 list
 * @param deptId 必须，部门id，number
 * @param enabled 非必须，是否启用，number
 * @param userName 非必须，用户昵称支持模糊查询
 */
export const postGetUserListByFormApi = (params: any) => {
  return http.post<any>(PORTAuth + `/user/management/getUserListByForm`, params);
};

/**
 * @name 获取带角色信息的用户列表 list
 */
export const getRoleUserListApi = () => {
  // console.warn("获取用户列表");
  return http.get<any>(PORTAuth + `/user/management/getRoleList`);
};

/**
 * @name 人员修改（业务）
 * @param userId 必须，用户id，number
 * @param password 非必须，用户密码
 * @param deptId 非必须，部门id，number
 * @param nickName 非必须，用户昵称
 * @param email 非必须，用户邮箱
 * @param roleIdList 非必须，角色id数组，number[]
 * @param enable 非必须，是否启用，0-禁用，1启用, number
 */
export const postUpdateUserApi = (params: any) => {
  return http.post(PORTAuth + `/user/management/updateUser`, params);
};

/**
 * @name 人员创建（业务）
 * @param userName 必须，用户名
 * @param password 必须，用户密码
 * @param deptId 必须，部门id，number
 * @param nickName 必须，用户昵称
 * @param email 必须，用户邮箱
 * @param roleIdList 必须，角色id数组，number[]
 */
export const postCreateUserApi = (params: any) => {
  return http.post(PORTAuth + `/user/management/createUser`, params);
};
