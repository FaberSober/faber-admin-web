package com.faber.msg.helper.properties;

import cn.hutool.core.util.ReflectUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.aliyuncs.CommonRequest;
import com.aliyuncs.CommonResponse;
import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.http.MethodType;
import com.aliyuncs.profile.DefaultProfile;
import com.faber.common.exception.BuzzException;
import com.faber.msg.helper.config.MsgSendConfig;
import com.faber.msg.helper.config.MsgSendSysConfig;
import com.faber.msg.helper.config.PropKey;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.util.List;

@Slf4j
@Configuration
@EnableConfigurationProperties(SmsProperties.class)
public class SmsConfiguration {

    private final SmsProperties properties;

    private IAcsClient client;

    @Autowired
    public SmsConfiguration(SmsProperties properties) {
        this.properties = properties;
    }

    @PostConstruct
    public void init() {
        DefaultProfile profile = DefaultProfile.getProfile(this.properties.getRegionId(), this.properties.getAccessKeyId(), this.properties.getSecret());
        this.client = new DefaultAcsClient(profile);
    }

    public void sendSms(String telNo, MsgSendConfig msgSendConfig) throws ClientException {
        PropKey propKey = this.getMsgSendPropKeyAnnotation(msgSendConfig);
        if (!propKey.smsEnable()) {
            return;
        }

        CommonRequest request = new CommonRequest();
        request.setSysMethod(MethodType.POST);
        request.setSysDomain("dysmsapi.aliyuncs.com");
        request.setSysVersion("2017-05-25");
        request.setSysAction("SendSms");
        request.putQueryParameter("RegionId", "cn-hangzhou");
        request.putQueryParameter("PhoneNumbers", telNo);
        request.putQueryParameter("SignName", this.properties.getSignName());

        SmsProperties.Config config = this.getSmsConfig(msgSendConfig);
        request.putQueryParameter("TemplateCode", config.getSmsCode());
        request.putQueryParameter("TemplateParam", this.getTemplateParam(config.getKeys(), msgSendConfig));

        CommonResponse response = client.getCommonResponse(request);
        log.debug(response.getData());
        JSONObject ret = JSON.parseObject(response.getData());
        String code = ret.getString("Code");
        if (!"OK".equalsIgnoreCase(code)) {
            log.error("??????????????????????????????" + response.getData());

            throw new BuzzException("??????????????????????????????" + response.getData());
        }
    }

    /**
     * ??????{@link PropKey}??????
     * @param msgSendConfig
     * @return
     */
    public static PropKey getMsgSendPropKeyAnnotation(MsgSendConfig msgSendConfig) {
        PropKey propKey = msgSendConfig.getClass().getAnnotation(PropKey.class);
        if (propKey == null) {
            throw new BuzzException("?????????" + msgSendConfig.getClass().getSimpleName() + "??????@PropKey??????");
        }
        return propKey;
    }

    /**
     * ??????????????????
     * @param msgSendConfig
     * @return
     */
    public SmsProperties.Config getSmsConfig(MsgSendConfig msgSendConfig) {
        PropKey propKey = this.getMsgSendPropKeyAnnotation(msgSendConfig);
        SmsProperties.Config config = this.properties.getSmsConfig().get(propKey.value());
        if (config == null) {
            throw new BuzzException("?????????SmsProperties???Config????????????" + propKey.value());
        }
        return config;
    }

    /**
     * ?????????????????????
     * 1. ????????????????????????????????????????????????????????????????????????
     * 2. ?????????????????????????????????content
     * @param msgSendConfig
     * @return
     */
    public String genTemplateContent(MsgSendConfig msgSendConfig) {
        PropKey propKey = this.getMsgSendPropKeyAnnotation(msgSendConfig);
        if (propKey.smsEnable()) {
            SmsProperties.Config config = this.getSmsConfig(msgSendConfig);
            String template = new String(config.getTemplate());
            for (String key : config.getKeys()) {
                template = template.replace("${" + key + "}", ReflectUtil.getFieldValue(msgSendConfig, key).toString());
            }
            return template;
        }
        if (msgSendConfig instanceof MsgSendSysConfig) {
            return ((MsgSendSysConfig) msgSendConfig).getContent();
        }
        return null;
    }

    private String getTemplateParam(List<String> keys, MsgSendConfig msgSendConfig) {
        JSONObject json = new JSONObject();
        for (String key : keys) {
            json.put(key, ReflectUtil.getFieldValue(msgSendConfig, key));
        }
        return json.toJSONString();
    }

}
