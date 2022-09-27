package com.faber.common.constant;

/**
 * 系统常用常量
 */
public class CommonConstants {

    // ---------------- 用户token异常 ----------------
    public static final Integer EX_USER_INVALID_CODE = 40101;
    public static final Integer EX_USER_PASS_INVALID_CODE = 40001;

    // ---------------- 用户无权访问 ----------------
    public static final Integer EX_USER_NO_PERMISSION = 40301;

    // ---------------- 其他异常 ----------------
    public static final Integer EX_OTHER_CODE = 500;

    // ---------------- 上下文信息 ----------------
    public static final String CONTEXT_KEY_LOGIN = "currentLogin";
    public static final String CONTEXT_KEY_USER_ID = "currentUserId";
    public static final String CONTEXT_KEY_USERNAME = "currentUserName";
    public static final String CONTEXT_KEY_PHONE = "currentPhone";
    public static final String CONTEXT_KEY_USER_NAME = "currentUser";
    public static final String CONTEXT_KEY_USER_TOKEN = "currentUserToken";
    public static final String CONTEXT_KEY_USER_IP = "currentUserIp";

    public static final String JWT_KEY_USER_ID = "userId";
    public static final String JWT_KEY_NAME = "name";

    // ---------------- Tree形数据根节点默认ID=0 ----------------
    public final static int ROOT = 0;

}
