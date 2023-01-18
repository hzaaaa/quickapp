// 菜单
declare namespace Menu {
  interface MenuOptions {
    id: number;
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
