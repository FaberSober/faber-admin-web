package com.faber.common.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 指定实体的排序字段
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(value={ElementType.FIELD,ElementType.TYPE})
public @interface SqlTreeName {
}
