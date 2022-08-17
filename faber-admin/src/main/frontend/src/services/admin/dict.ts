import queryString from 'querystring';
import { requestGet } from '@/utils/request';
import { GATE_APP } from '@/configs/server.config';
import Admin from '@/props/admin';
import { BaseApi } from '@/services/base';
import Ajax from '@/props/base/Ajax';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'dict';

class Dict extends BaseApi<Admin.Dict, number> {
	/** 获取实体List */
	listByCode = (dictTypeCode: string): Promise<Ajax.Response<Admin.Dict[]>> =>
		requestGet(`${GATE_APP.admin}/${serviceModule}/listByCode?${queryString.stringify({ dictTypeCode })}`);

	/** 获取实体List */
	getByCodeAndText = (dictTypeCode: string, dictText: string): Promise<Ajax.Response<Admin.Dict[]>> =>
		requestGet(`${GATE_APP.admin}/${serviceModule}/getByCodeAndText?${queryString.stringify({ dictTypeCode, dictText })}`);

	/** 获取实体List */
	getByCodeAndValue = (dictTypeCode: string, dictValue: string): Promise<Ajax.Response<Admin.Dict[]>> =>
		requestGet(`${GATE_APP.admin}/${serviceModule}/getByCodeAndValue?${queryString.stringify({ dictTypeCode, dictValue })}`);

	/** 获取系统配置参数 */
	getSystemConfig = (): Promise<Ajax.Response<Admin.SystemConfigPo>> => requestGet(`${GATE_APP.admin}/${serviceModule}/getSystemConfig`);
}

export default new Dict(GATE_APP.admin, serviceModule);
