/**
 * @description 递归过滤出需要渲染在左侧菜单的列表（剔除 hidden == 1 及 type>5 的权限菜单项）
 * @param {Array} menuList 所有菜单列表
 * @return array
 */
export function getShowMenuList(menuList: Menu.MenuOptions[]) {
  let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  let hiddenList = ["部门设置", "菜单设置", "角色设置", "用户设置"];
  return newMenuList.filter((item) => {
    // 初始自带的几个设置菜单不显示在此系统中
    if (hiddenList.includes(item.title)) return false;
    item.childrenList?.length && (item.childrenList = getShowMenuList(item.childrenList));
    return item.hidden == 0 && item.type <= 5;
  });
}

/**
 * @description 递归过滤出用于生成动态路由的列表（剔除 type>5 的权限菜单项）
 * @param {Array} menuList 所有菜单列表
 * @return array
 */
export function getRouterMenuList(menuList: Menu.MenuOptions[]) {
  let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  // 初始自带的几个设置菜单不在此系统中生成动态路由
  let hiddenList = ["部门设置", "菜单设置", "角色设置", "用户设置"];
  return newMenuList.filter((item) => {
    if (hiddenList.includes(item.title)) return false;
    item.childrenList?.length && (item.childrenList = getRouterMenuList(item.childrenList));
    return item.type <= 5;
  });
}

// /**
//  * @description 扁平化数组对象(主要用来处理路由菜单)
//  * @param {Array} menuList 所有菜单列表
//  * @return array
//  */
// export function getFlatArr(menuList: Menu.MenuOptions[]) {
//   let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
//   return newMenuList.reduce((pre: Menu.MenuOptions[], current: Menu.MenuOptions) => {
//     let flatArr = [...pre, current];
//     if (current.childrenList) flatArr = [...flatArr, ...getFlatArr(current.childrenList)];
//     return flatArr;
//   }, []);
// }

/**
 * @description 从路由列表中，找到第一个路由作为初始默认路由
 */
export function getFisrtRoute(routes: any): any {
  if (routes instanceof Array) {
    // 如果是路由数组
    for (let route of routes) {
      if (route.children) return getFisrtRoute(route.children);
      if (route.name) return { name: route.name };
      if (route.path) return { path: route.path };
    }
  } else {
    // 如果是单个路由
    if (routes.children) return getFisrtRoute(routes.children);
    if (routes.name) return { name: routes.name };
    if (routes.path) return { path: routes.path };
  }
  return null;
}
