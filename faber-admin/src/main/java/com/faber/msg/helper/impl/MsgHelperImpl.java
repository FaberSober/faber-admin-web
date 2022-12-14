package com.faber.msg.helper.impl;

import com.faber.admin.biz.UserBiz;
import com.faber.admin.entity.User;
import com.faber.common.enums.BoolEnum;
import com.faber.msg.biz.MsgBiz;
import com.faber.msg.entity.Msg;
import com.faber.msg.helper.MsgHelper;
import com.faber.msg.helper.config.MsgSendConfig;
import com.faber.msg.helper.properties.SmsConfiguration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

@Slf4j
@Component
public class MsgHelperImpl implements MsgHelper {

    @Resource
    private MsgBiz msgBiz;

    @Resource
    private UserBiz userBiz;

    @Resource
    private SmsConfiguration smsConfiguration;

    @Override
    public void sendSysMsg(String fromUserId, String toUserId, MsgSendConfig msgSendConfig) {
        this.sendSysMsg(fromUserId, new String[]{toUserId}, msgSendConfig);
    }

    @Override
    public void sendSysMsg(String fromUserId, String[] toUserIds, MsgSendConfig msgSendConfig) {
        if (toUserIds == null || toUserIds.length == 0) return;

        for (String toUserId : toUserIds) {
            User user = userBiz.getUserById(toUserId);
            if (user == null) continue;

            Msg msg = this.genBaseMsg(fromUserId, toUserId, msgSendConfig);

            String appPushContent = smsConfiguration.genTemplateContent(msgSendConfig);
            msg.setContent(appPushContent);

            // 发送模板短信
            if (msgSendConfig.isSendSms()) {
                try {
                    smsConfiguration.sendSms(user.getTel(), msgSendConfig);
                } catch (Exception e) {
                    log.error(e.getMessage(), e);
                }
            }

            msgBiz.save(msg);
        }
    }

    private Msg genBaseMsg(String fromUserId, String toUserId, MsgSendConfig msgSendConfig) {
        Msg msg = new Msg();
        msg.setFromUserId(fromUserId);
        msg.setToUserId(toUserId);
        msg.setBuzzType(msgSendConfig.getBuzzType());
        msg.setBuzzId(msgSendConfig.getBuzzId());
        msg.setIsRead(BoolEnum.NO);
        return msg;
    }
}
