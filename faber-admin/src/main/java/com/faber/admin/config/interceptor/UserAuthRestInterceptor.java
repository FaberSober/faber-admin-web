package com.faber.admin.config.interceptor;

import com.faber.admin.biz.UserBiz;
import com.faber.admin.config.annotation.IgnoreUserToken;
import com.faber.admin.entity.User;
import com.faber.admin.util.jwt.IJWTInfo;
import com.faber.admin.util.user.UserCheckUtil;
import com.faber.common.context.BaseContextHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 用户授权过滤器
 * 1. 过滤request#header的jwt token授权字段：Authorization
 */
@Slf4j
public class UserAuthRestInterceptor extends AbstractInterceptor {

    @Autowired
    private UserBiz userBiz;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 配置该注解，说明不进行用户拦截
        IgnoreUserToken annotation = getIgnoreUserToken(handler);
        if (annotation != null) {
            return super.preHandle(request, response, handler);
        }

        IJWTInfo infoFromToken = super.getJwtInfo(request);

        // 判断用户状态是否正常
        User user = userBiz.getUserById(infoFromToken.getId());
        UserCheckUtil.checkUserValid(user);

        BaseContextHandler.setUsername(infoFromToken.getUniqueName());
        BaseContextHandler.setName(infoFromToken.getName());
        BaseContextHandler.setUserID(infoFromToken.getId());
        return super.preHandle(request, response, handler);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        BaseContextHandler.remove();
        super.afterCompletion(request, response, handler, ex);
    }
}
