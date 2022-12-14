package com.faber.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.faber.admin.entity.Config;
import org.apache.ibatis.annotations.Param;

/**
 * 系统-配置表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-02 21:21:45
 */
// @Mapper
public interface ConfigMapper extends BaseMapper<Config> {

    int findMaxSort(@Param("buzzModal") String buzzModal, @Param("type") String type, @Param("belongUserId") String belongUserId);

    void clearOtherDefaultScene(@Param("buzzModal") String buzzModal, @Param("type") String type, @Param("belongUserId") String belongUserId);

}
