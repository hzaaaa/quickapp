import http from "@/api";

import { PORTAuth, PORTBiz } from "@/api/config/servicePort";
import { Login } from "@/api/interface";

/**
 * @name 登录模块
 */
export const loginApi = (params: Login.ReqLoginForm) => {
  // console.warn("调用 login 接口");
  return http.post<Login.ResLogin>(PORTAuth + `/auth/login`, params);
  return http.post<Login.ResLogin>(PORTAuth + `/auth/login`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
};
/**
 * @name 获取验证码图片
 */
export const captcha = () => {
  return http.get<Login.ResCaptcha>(PORTAuth + `/auth/captcha`);
};
/**
 * @name 获取按钮权限列表
 */
export const getAuthButtonListApi = () => {
  // console.warn("调用获取按钮权限接口");
  return http.get<string[]>(PORTAuth + `/menu/user/permission`);
};
/**
 * @name 退出登录
 */
export const logoutApi = () => {
  return http.post(PORTAuth + `/auth/logout`);
};
/**
 * @name  Redis 初始化/重置 
 */
export const redisResetApi = () => {
  return http.get(PORTBiz + `/redis/redisReset`);
};
