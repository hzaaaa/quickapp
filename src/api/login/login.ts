import http from "@/api";
// * 登录模块 interface
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
  }
  export interface ResLogin {
    id: number;
    username: string;
    home: string;
    [key: string]: any;
  }
}

/**
 * @name 登录模块
 */
export const login = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(`/user/login`, params);
  return http.post<Login.ResLogin>(`/user/login`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
};
