package com.faber.common.config;

import com.alibaba.excel.converters.Converter;
import com.alibaba.excel.enums.CellDataTypeEnum;
import com.alibaba.excel.metadata.CellData;
import com.alibaba.excel.metadata.GlobalConfiguration;
import com.alibaba.excel.metadata.property.ExcelContentProperty;
import com.faber.common.enums.BaseEnum;
import org.springframework.stereotype.Component;

/**
 * FIXME：导出Excel需要适配Enum类型属性的转换
 */
@Component
public class BaseEnumConverter implements Converter<BaseEnum> {

    @Override
    public Class supportJavaTypeKey() {
        return BaseEnum.class;
    }

    @Override
    public CellDataTypeEnum supportExcelTypeKey() {
        return CellDataTypeEnum.STRING;
    }

    @Override
    public BaseEnum convertToJavaData(CellData cellData, ExcelContentProperty excelContentProperty, GlobalConfiguration globalConfiguration) throws Exception {
//        String stringValue = cellData.getStringValue();
        return null;
    }

    @Override
    public CellData convertToExcelData(BaseEnum iEnum, ExcelContentProperty excelContentProperty, GlobalConfiguration globalConfiguration) throws Exception {
        return new CellData(iEnum.getValDesc());
    }
}

