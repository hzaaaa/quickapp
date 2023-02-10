import qs from "qs";
import http from "@/api";
import { PORTAuth } from "../config/servicePort";

/**
 * @name 获取菜单列表 list
 * @param title 非必须，菜单名称模糊字段
 */
export const getMenuListApi = (params?: any) => {
  // console.warn("获取菜单列表");
  return http.get(PORTAuth + `/menu/list?${qs.stringify(params)}`);
};

/**
 * @name 获取菜单信息 info
 * @param id 必须，菜单id，number
 */
export const getMenuInfoApi = (params: any) => {
  // console.warn("获取菜单信息");
  return http.get(PORTAuth + `/menu/info?${qs.stringify(params)}`);
};

/**
 * @name 获取菜单树 tree
 * @param menuId 必须，菜单id，number
 */
export const getMenuTreeApi = (params: { menuId: number }) => {
  // console.warn("获取菜单树");
  return http.get<any>(PORTAuth + `/menu/tree?${qs.stringify(params)}`);
};

/**
 * @name 获取用户菜单树 usertree
 */
export const getMenuUserTreeApi = () => {
  return http.get(PORTAuth + `/menu/user/tree`);
};

/**
 * @name 菜单添加 add
 * @param title 必须，菜单名称
 * @param type 必须，菜单类型，number, 1-5菜单，6按钮
 * @param pid 必须，父菜单id，number, 没有则填 0
 * @param sort 非必须，同级排序，number
 * @param component 非必须，路由组件在前端项目的地址
 * @param permission 非必须，接口权限值
 * @param icon 非必须，菜单icon图标
 * @param router 非必须，路由名
 * @param redirect 非必须，路由地址栏路径
 * @param hidden 非必须，是否隐藏，number, 0否1是
 * @param affix 非必须，是否固定在tables，number, 0否1是
 * @param keepAlive 非必须，是否缓存页面，number, 0否1是
 */
export const postMenuAddApi = (params: any) => {
  return http.post(PORTAuth + `/menu/add`, params);
  // return http.post(PORTAuth + `/menu/add`);
  // return http.post<Login.ResLogin>(PORT1 + `/menu/add`, params, { headers: { noLoading: true } }); // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(PORT1 + `/menu/add`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/menu/add`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(PORT1 + `/menu/add?${qs.stringify(params, { arrayFormat: "repeat" })}`); // 如果是 get 请求可以携带数组等复杂参数
};

/**
 * @name 菜单修改 update
 * @param id 必须，菜单id，number
 * @param title 非必须，菜单名称
 * @param type 非必须，菜单类型，number, 1-5菜单，6按钮
 * @param pid 非必须，父菜单id，number, 没有则填 0
 * @param sort 非必须，同级排序，number
 * @param component 非必须，路由组件在前端项目的地址
 * @param permission 非必须，接口权限值
 * @param icon 非必须，菜单icon图标
 * @param router 非必须，路由名
 * @param redirect 非必须，路由地址栏路径
 * @param hidden 非必须，是否隐藏，number, 0否1是
 * @param affix 非必须，是否固定在tables，number, 0否1是
 * @param keepAlive 非必须，是否缓存页面，number, 0否1是
 */
export const postMenuUpdateApi = (params: any) => {
  return http.post(PORTAuth + `/menu/update`, params);
};

/**
 * @name 菜单删除 delete
 * @param id 必须，菜单id，number
 */
export const postMenuDeleteApi = (params: any) => {
  return http.post(PORTAuth + `/menu/delete`, params);
};
