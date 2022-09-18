import { GATE_APP } from '@/configs/server.config';
import Ajax from '@/props/base/Ajax';
import Admin from '@/props/admin';
import { BaseApi } from '@/services/base';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'job';

class Job extends BaseApi<Admin.Job, number> {
	/** 获取唯一实体 */
	runOneTime = (id: number): Promise<Ajax.Response> => super.get(`runOneTime/${id}`);

	/** 获取唯一实体 */
	startJob = (id: number): Promise<Ajax.Response> => super.get(`startJob/${id}`);

	/** 获取唯一实体 */
	endJob = (id: number): Promise<Ajax.Response> => super.get(`endJob/${id}`);

	/** 获取cron最近5次运行时间 */
	quartzLatest = (cron: string, times: number): Promise<Ajax.Response<string[]>> =>
		super.post(
			`quartz/latest`,
			{ cron, times },
			{
				headers: { hideErrorMsg: '1' },
			},
		);
}

export default new Job(GATE_APP.admin, serviceModule);
