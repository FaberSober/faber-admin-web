package com.faber.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.annotation.FaModalName;
import com.faber.common.annotation.SqlEquals;
import com.faber.common.bean.BaseDelEntity;
import com.faber.common.enums.BoolEnum;
import lombok.Data;


/**
 * BASE-登录日志
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-27 17:09:01
 */
@FaModalName(name = "BASE-登录日志")
@TableName("base_log_login")
@Data
public class LogLogin extends BaseDelEntity {

    @ExcelProperty("序号")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @ExcelProperty("访问客户端")
    private String agent;

    @ExcelProperty("操作系统")
    private String os;

    @ExcelProperty("浏览器")
    private String browser;

    @ExcelProperty("浏览器版本")
    private String version;

    @SqlEquals
    @ExcelProperty("是否为移动终端")
    private BoolEnum mobile;

    @ExcelProperty("省")
    private String pro;

    @ExcelProperty("市")
    private String city;

    @ExcelProperty("地址")
    private String addr;

}
