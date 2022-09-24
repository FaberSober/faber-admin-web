import React, {useContext} from 'react';
import {Menu} from "antd";
import FaberEnums from "@/props/base/FaberEnums";
import MenuLayoutContext from "@/layout/menu/context/MenuLayoutContext";


/**
 * 顶部水平的菜单
 * @author xu.pengfei
 * @date 2022/9/23
 */
export default function MenuAppHorizontal() {
  const { menuFullTree, menuSelAppId, setMenuSelAppId } = useContext(MenuLayoutContext)

  const blocks = menuFullTree.filter((i) => i.sourceData.level === FaberEnums.RbacMenuLevelEnum.APP)
  const items = blocks.map((i) => ({
    key: i.id,
    label: i.name,
    icon: i.sourceData.icon ? <i className={i.sourceData.icon} /> : null,
  }))
  return (
    <Menu
      mode="horizontal"
      theme="dark"
      items={items}
      selectedKeys={menuSelAppId ? [menuSelAppId] : []}
      onSelect={({ key }) => setMenuSelAppId(key)}
      style={{ flex: 1 }}
    />
  )
}
