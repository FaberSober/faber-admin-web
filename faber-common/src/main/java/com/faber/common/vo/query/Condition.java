package com.faber.common.vo.query;

import com.faber.common.vo.query.enums.ConditionOprEnum;
import lombok.Data;

import java.io.Serializable;

@Data
public class Condition implements Serializable {

    private String id;
    private ConditionOprEnum opr;
    private String key;
    private String title;
    private Object value;

    private String begin; // opr=between
    private String end; // opr=between

}
