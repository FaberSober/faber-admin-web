package com.faber.rbac.vo.query;

import com.faber.common.vo.BasePageQuery;
import lombok.Data;
import lombok.ToString;

import java.io.Serializable;

@Data
@ToString
public class RbacUserRoleQueryVo extends BasePageQuery {

    private Long roleId;
    private String name;
    private String username;

}
