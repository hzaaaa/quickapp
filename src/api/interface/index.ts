// * 请求响应参数(不包含data)
export interface Result {
  code: number;
  msg: string;
}
// * 请求响应参数(包含data)
export interface ResultData<T> extends Result {
  data: T;
}
// * 请求配置枚举
export enum ResultEnum {
  SUCCESS = 200,
  ERROR = 500,
  OVERDUE = 415, // login expire
  TIMEOUT = 10000,
  TYPE = "success",
}

// * 登录模块 interface
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
    type: number;
    captchaId?: string;
    code?: string;
  }
  export interface ResLogin {
    token: string;
    [key: string]: any;
  }
  export interface ResCaptcha {
    captchaId: string;
    img: string;
  }
}

// * biz业务 素材模块
export namespace Material {
  export interface Project {
    projectId: number;
    projectName: string;
    [key: string]: any;
  }
  export interface Indus {
    indusId: number;
    indusName: string;
    indusRemark: string;
    projectList: Project[];
    [key: string]: any;
  }
}

// * biz业务 账户 -> 人员管理模块
export namespace Account {
  export interface MediaAccount {
    advertiserId: number;
    companyId: number;
    companyName: string;
    mediaCategory: string;
    mediaCategoryName: string;
    remoteAdvertiserId: number;
    remoteAdvertiserName: string;
  }
}
