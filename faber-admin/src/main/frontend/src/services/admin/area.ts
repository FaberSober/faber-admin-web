import { GATE_APP } from '@/configs/server.config';
import Ajax from '@/props/base/Ajax';
import FaberBase from '@/props/base/FaberBase';
import Admin from '@/props/admin';
import { BaseApi } from '@/services/base';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'area';

interface PathResData {
	list: Admin.Area[];
	tree: FaberBase.TreeNode[];
}

class AreaApi extends BaseApi<Admin.Area, number> {
	/** 获取唯一 xx */
	findOnePath = (areaCode: number): Promise<FaberBase.Response<PathResData>> => this.get(`path/${areaCode}`);

	/** 获取唯一 xx */
	findByAreaCode = (areaCode: number): Promise<FaberBase.Response<Admin.Area>> => this.get(`findByAreaCode/${areaCode}`);

	/** 获取唯一实体 */
	findAreaByLoc = (lng: number, lat: number): Promise<FaberBase.Response<Admin.Area>> => this.get(`findAreaByLoc?lng=${lng}&lat=${lat}`);
}

export default new AreaApi(GATE_APP.admin, serviceModule);
