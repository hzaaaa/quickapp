// 菜单
declare namespace Menu {
  interface MenuOptions {
    title: string;
    type: number;
    hidden: number;
    component?: string;
    permission?: string;
    router?: string;
    icon?: string;
    redirect?: string;
    childrenList?: MenuOptions[];
  }
}
