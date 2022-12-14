import {GATE_APP} from '@/configs/server.config';
import {BaseZeroApi} from '@/services/base';
import {Fa} from "@/props/base";
import Admin from "@/props/admin";

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class SystemApi extends BaseZeroApi<any, string> {

  /** 获取服务器信息 */
  server = (): Promise<Fa.Response<Admin.ServerInfo>> => this.get('server');

}

export default new SystemApi(GATE_APP.admin, 'system');
