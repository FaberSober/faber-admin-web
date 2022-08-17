import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import userApi from '@/services/admin/user';
import msgApi from '@/services/admin/msg';
import dictApi from '@/services/admin/dict';
import { RES_CODE } from '@/configs/server.config';
import { clearToken } from '@/utils/cache';
import {PageLoading} from "@/components/antd-pro";
import FaberBase from "@/props/base/FaberBase";
import BaseNotice from "@/components/biz/base-notice";
import Admin from "@/props/admin";

const defaultUser: FaberBase.UserInfo = {
  id: '0',
  name: '',
  username: '',
  img: '',
  description: '',
  departmentId: '0',
  elements: [],
  menus: [],
};

interface CProps {
  // -------------------- 登录账户信息 --------------------
  user: FaberBase.UserInfo;
  refreshUser: () => void; // 更新用户信息
  logout: () => void; // 登出
  // -------------------- 消息 --------------------
  unreadCount: number; // 未读消息数量
  refreshUnreadCount: () => void;
  // -------------------- 消息 --------------------
  systemConfig: Admin.SystemConfigPo,
}

const defaultConfig = { title: '', logo: '', logoWithText: '', portalLink: '' }

export const UserContext = createContext<CProps>({
  user: defaultUser,
  refreshUser: () => {},
  logout: () => {},
  unreadCount: 0,
  refreshUnreadCount: () => {},
  systemConfig: defaultConfig,
});

interface IProps extends RouteComponentProps {
  children?: ReactNode | Element;
}

/**
 * 带用户校验的Layout，必须登录用户才可以访问网页
 * @author xu.pengfei
 * @date 2021/1/4
 */
export default function UserSimpleLayout({ children }: IProps) {
  const [user, setUser] = useState<FaberBase.UserInfo>(defaultUser);
  const [loading, setLoading] = useState<boolean>(true)
  const [systemConfig, setSystemConfig] = useState<Admin.SystemConfigPo>(defaultConfig);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUserInfo();
    fetchUnreadCount();
    getSystemConfig();
  }, []);

  // 获取登录用户信息
  function fetchUserInfo() {
    userApi.getUserInfo().then((res) => {
      if (res && res.status === RES_CODE.OK) {
        setUser(res.data);
      }
    });
  }

  // 获取系统配置参数
  function getSystemConfig() {
    setLoading(true)
    dictApi.getSystemConfig().then((res) => {
      setLoading(false)
      if (res && res.status === RES_CODE.OK) {
        if (res.data) {
          setSystemConfig(res.data);
        }
      }
    }).catch(() => setLoading(false))
  }

  function handleLogout() {
    clearToken();
    navigate('/login');
  }

  // 未读消息数量
  function fetchUnreadCount() {
    msgApi.countMine().then((res) => {
      if (res && res.status === RES_CODE.OK) {
        setUnreadCount(res.data.unreadCount);
      }
    });
  }

  const contextValue: CProps = {
    user,
    refreshUser: fetchUserInfo,
    logout: handleLogout,
    unreadCount,
    refreshUnreadCount: fetchUnreadCount,
    systemConfig,
  };

  if (user === undefined) return <PageLoading style={{ height: '100vh', width: '100vw' }} />
  if (loading) return <PageLoading style={{ height: '100vh', width: '100vw' }} />

  return (
    <UserContext.Provider value={contextValue}>
      <div style={{ height: '100vh', width: '100vw', overflow: 'auto' }}>
        <BaseNotice />
        {children}
      </div>
    </UserContext.Provider>
  );
}
