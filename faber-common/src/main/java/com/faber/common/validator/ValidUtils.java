package com.faber.common.validator;

import org.springframework.util.StringUtils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ValidUtils {

    public static boolean validTelNo(String phone) {
        String regex = "^1[3456789]\\d{9}$";
        if(phone.length() != 11){
            return false;
        }else{
            Pattern p = Pattern.compile(regex);
            Matcher m = p.matcher(phone);
            boolean isMatch = m.matches();
            return isMatch;
        }
    }

    public static final String[] FILE_NAME_EXCLUDE = new String[]{"'", "<", ">", "$", "%", "^", "&", "*", "&lt;", "&gt;", ";", "#", ",", ".", "|"};

    public static boolean fileNameSafe(String str) {
        if (StringUtils.isEmpty(str)) return true;
        for (String sql : FILE_NAME_EXCLUDE) {
            if (str.contains(sql)) return false;
        }
        return true;
    }

    public static final String[] SQL_STR = new String[]{"-", "|,", "[", "]", "'", "<", ">", "$", "%", "^", "&", "*", "(", ")", "&lt;", "&gt;", ";", "_", "#", "=", ",", ".", "+"};

    public static boolean sqlSafe(String str) {
        if (StringUtils.isEmpty(str)) return true;
        for (String sql : SQL_STR) {
            if (str.contains(sql)) return false;
        }
        return true;
    }

    public static final String[] UPLOAD_STR = new String[]{"|,", "[", "]", "'", "<", ">", "$", "%", "^", "&", "*", "(", ")", "&lt;", "&gt;", ";", "_", "#", "=", ","};

    public static boolean uploadSafe(String str) {
        if (StringUtils.isEmpty(str)) return true;
        for (String sql : UPLOAD_STR) {
            if (str.contains(sql)) return false;
        }
        return true;
    }

    public static boolean isValidIp(String ip) {
        String ipReg = "((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})(\\.((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})){3}";
        if (!Pattern.compile(ipReg).matcher(ip).matches()) {
            return false;
        }
        return true;
    }

    public static boolean hasNoBlank(String str) {
        if (StringUtils.isEmpty(str)) return true;
        return !str.contains(" ");
    }

    public static final String[] FXX_HTML = new String[]{"&lt;\\s*script\\s*&gt;", "&lt;\\s*/\\s*script\\s*&gt;"};

    /**
     * HTML???????????????<script>???</script>????????????
     */
    public static boolean fxxHtmlSafe(String str) {
        if (StringUtils.isEmpty(str)) return true;
        for (String sql : FXX_HTML) {
            if (Pattern.compile(sql).matcher(str).find()) {
                return false;
            }
            // if (str.contains(sql)) return false;
        }
        return true;
    }

}
