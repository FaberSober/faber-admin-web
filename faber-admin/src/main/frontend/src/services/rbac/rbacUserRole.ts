import {GATE_APP} from '@/configs/server.config';
import {BaseApi} from '@/services/base';
import Rbac from '@/props/rbac';
import Fa from "../../props/base/Fa";

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class RbacUserRoleApi extends BaseApi<Rbac.RbacUserRole, string> {
  /** 获取账户的角色列表 */
  getUserRoles = (userId: string): Promise<Fa.Response<Rbac.RbacRole[]>> => this.get(`getUserRoles/${userId}`);

	/** 获取登录账户的角色列表 */
	getMyRoles = (): Promise<Fa.Response<Rbac.RbacRole[]>> => this.get('getMyRoles');

	/** 获取登录账户的权限列表 */
	getMyMenus = (): Promise<Fa.Response<Rbac.RbacMenu[]>> => this.get('getMyMenus');

	/** 获取登录账户的权限Tree */
  getMyMenusTree = (): Promise<Fa.Response<Fa.TreeNode<Rbac.RbacMenu>[]>> => this.get('getMyMenusTree');

	/** 获取实体 分页 */
	pageVo = (params: Rbac.RbacUserRoleQueryVo): Promise<Fa.Response<Fa.Page<Rbac.RbacUserRoleRetVo>>> => this.post('pageVo', params);
}

export default new RbacUserRoleApi(GATE_APP.rbac, 'rbacUserRole');
