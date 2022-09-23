import { createContext } from 'react';
import FaberBase from "@/props/base/FaberBase";
import Rbac from "@/props/rbac";


export interface MenuLayoutContextProps {
  menuList: Rbac.RbacMenu[], // 当前展示的菜单树
  menuFullTree: FaberBase.TreeNode<Rbac.RbacMenu>[], // 完整的菜单树
  menuTree: FaberBase.TreeNode<Rbac.RbacMenu>[],
  menuSelAppId: string | undefined, // 选中的菜单模块id
  menuSelPath: string[], // 选中的菜单路径
  setMenuSelPath: (key: string, keyPath: string[]) => void,
  setMenuSelAppId: (id: string) => void,
  collapse: boolean,
  setCollapse: (v: boolean) => void,
  openSideMenuKeys: string[],
  setOpenSideMenuKeys: (v: string[]) => void,
  openTabs: Rbac.RbacMenu[], // 打开的菜单历史记录
}

const MenuLayoutContext = createContext<MenuLayoutContextProps>({
  menuList: [],
  menuFullTree: [],
  menuTree: [],
  menuSelAppId: undefined,
  menuSelPath: [],
  setMenuSelPath: () => {},
  setMenuSelAppId: () => {},
  collapse: false,
  setCollapse: () => {},
  openSideMenuKeys: [],
  setOpenSideMenuKeys: () => {},
  openTabs: [],
});

export default MenuLayoutContext;
