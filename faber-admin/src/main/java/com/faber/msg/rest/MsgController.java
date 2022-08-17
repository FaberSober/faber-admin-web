package com.faber.msg.rest;

import com.faber.common.bean.BaseDelEntity;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.msg.TableResultResponse;
import com.faber.msg.entity.Msg;
import com.faber.msg.vo.MsgStatisticVO;
import com.faber.common.rest.BaseController;
import com.faber.common.util.Query;
import com.faber.msg.biz.MsgBiz;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/msg")
public class MsgController extends BaseController<MsgBiz, Msg> {

    /**
     * 消息数量统计。
     * 1. 未读消息数量；
     */
    @RequestMapping(value = "/count/mine", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse countMine() {
        MsgStatisticVO data = baseBiz.countMine();
        return ok(data);
    }

    /**
     * 分页查询
     */
    @RequestMapping(value = "/page/mine", method = RequestMethod.POST)
    @ResponseBody
    public TableResultResponse<Msg> pageMine(@RequestBody Map<String, Object> params) {
        params.put("toUserId", getCurrentUserId());
        params.put("delState", BaseDelEntity.DEL_STATE.AVAILABLE);
        //查询列表数据
        Query query = new Query(params);
        return baseBiz.selectPageByQuery(query);
    }


    /**
     * 批量已读
     * @param params
     * @return
     */
    @RequestMapping(value = "/batchRead", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse batchRead(@Valid @RequestBody Map<String, Object> params) {
        baseBiz.batchRead(params);
        return ok();
    }

}