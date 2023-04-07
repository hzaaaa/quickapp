/**
 * @description 递归过滤出用于生成动态路由的列表（将 subLayout 的后代节点递归取出当作 subLayout 的子节点，若无 subLayout ，将 layout 后代节点取出当作 layout 子节点）
 * @param {Array} menuList 所有菜单列表
 * @return array
 */
export function getRouterMenuList(menuList: Menu.MenuOptions[]) {
  let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  // 初始自带的几个设置菜单不在此系统中生成动态路由
  let hiddenList = ["部门设置", "菜单设置", "角色设置", "用户设置", "基础权限"];
  return newMenuList.filter((item) => {
    if (hiddenList.includes(item.title)) return false;

    if (item.component === "Layout" && !item.childrenList![0].component) {
      item.childrenList = flatMenuList(item.childrenList!);
      return true;
    }
    if (item.component === "subLayout") {
      item.childrenList = flatMenuList(item.childrenList!);
      return true;
    }
    item.childrenList?.length && (item.childrenList = getRouterMenuList(item.childrenList));
    return true;
  });
}

/**
 * @description 递归拉平所有子孙节点，取出所有 component 有值的路由对象
 * @param {Array} menuList 所有菜单列表
 * @return array
 */
export function flatMenuList(menuList: Menu.MenuOptions[]) {
  let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  newMenuList.forEach((item) => {
    let child = <any[]>[];
    if (item.childrenList) {
      child = flatMenuList(item.childrenList);
      item.childrenList = [];
    }
    if (child.length) newMenuList.push(...child);
  });
  return newMenuList.filter((item) => item.component);
}

/**
 * @description 递归过滤出需要渲染在左侧菜单的列表（剔除 type>5 的权限菜单项）
 * @param {Array} menuList 所有菜单列表
 * @return array
 */
export function getShowMenuList(menuList: Menu.MenuOptions[]) {
  let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  let hiddenList = ["部门设置", "菜单设置", "角色设置", "用户设置", "基础权限"];
  return newMenuList.filter((item) => {
    // 初始自带的几个设置菜单不显示在此系统中
    if (hiddenList.includes(item.title)) return false;
    if (item.hidden === 1) return false;
    item.childrenList?.length && (item.childrenList = getShowMenuList(item.childrenList));
    return item.type <= 6;
  });
}

/**
 * @description 递归过滤出用于角色管理页面渲染的列表（剔除  hidden == 1  的权限菜单项）
 * @param {Array} menuList 所有菜单列表
 * @return array
 */
export function getRoleMenuList(menuList: Menu.MenuOptions[]) {
  let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  // 初始自带的几个设置菜单不在此系统中生成动态路由
  let hiddenList = ["部门设置", "菜单设置", "角色设置", "用户设置", "基础权限"];
  return newMenuList.filter((item) => {
    if (hiddenList.includes(item.title)) return false;

    item.childrenList?.length && (item.childrenList = getRouterMenuList(item.childrenList));
    return item.hidden == 0;
  });
}



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
