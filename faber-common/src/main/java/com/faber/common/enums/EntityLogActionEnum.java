package com.faber.common.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum EntityLogActionEnum implements IEnum<Integer> {
    ADD(1, "新增"),
    UPDATE(2, "更新"),
    DEL(3, "删除");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    EntityLogActionEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
