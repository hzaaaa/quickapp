/**
 * @description 递归过滤出需要渲染在左侧菜单的列表（剔除 hidden == 1 及 type>5 的权限菜单项）
 * @param {Array} menuList 所有菜单列表
 * @return array
 */
export function getShowMenuList(menuList: Menu.MenuOptions[]) {
  let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.filter((item) => {
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
  return newMenuList.filter((item) => {
    item.childrenList?.length && (item.childrenList = getShowMenuList(item.childrenList));
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
