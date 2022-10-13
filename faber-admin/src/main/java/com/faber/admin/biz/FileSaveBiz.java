package com.faber.admin.biz;

import com.alibaba.fastjson.JSONObject;
import com.faber.admin.entity.FileSave;
import com.faber.admin.mapper.FileSaveMapper;
import com.faber.common.biz.BaseBiz;
import com.faber.common.exception.BuzzException;
import com.faber.common.file.FileHelperImpl;
import com.faber.common.util.file.QiniuHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;

/**
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-19 10:09:36
 */
@Service
public class FileSaveBiz extends BaseBiz<FileSaveMapper, FileSave> {

    @Resource
    private FileHelperImpl fileHelper;

    @Resource
    private QiniuHelper qiniuHelper;

    @Override
    public boolean save(FileSave entity) {
        entity.setDrive(fileHelper.getDrive());
        return super.save(entity);
    }

    public FileSave upload(MultipartFile file) throws IOException {
        String url = fileHelper.upload(file);

        FileSave fileSaveEntity = new FileSave();
        fileSaveEntity.setName(file.getOriginalFilename());
        fileSaveEntity.setSize(file.getSize());
        fileSaveEntity.setUrl(url);

        save(fileSaveEntity);

        return fileSaveEntity;
    }

    public void getFile(String fileId) throws IOException {
        FileSave fileSaveEntity = getById(fileId);

        switch (fileSaveEntity.getDrive()) {
            case LOCAL:
                this.getLocalFilePath(fileSaveEntity.getUrl());
                break;
            case QINIU:
            case ALI:
            case TX:
                HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
                response.sendRedirect(fileSaveEntity.getUrl());
                break;
        }
    }

    /**
     * 根据文件路径，获取存储文件，返回到http流进行下载
     * @param filePath
     * @throws IOException
     */
    public void getLocalFilePath(String filePath) throws IOException {
        if (filePath.contains("..")) {
            throw new BuzzException("非法文件名");
        }

        if (!filePath.startsWith("/static")) {
            filePath = "/static" + filePath; // 默认追加static前缀文件夹
        }

        File path = new File(ResourceUtils.getURL("classpath:").getPath());
        if (!path.exists()) path = new File("");
        File file = new File(path.getAbsolutePath(), filePath);

        HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
        response.setCharacterEncoding("utf-8");
        String fileName = URLEncoder.encode(file.getName(), "UTF-8");
        response.setHeader("Content-disposition", "attachment;filename=" + fileName);

        //4.获取要下载的文件输入流
        InputStream in = new FileInputStream(file);
        int len = 0;
        //5.创建数据缓冲区
        byte[] buffer = new byte[1024];
        //6.通过response对象获取OutputStream流
        OutputStream out = response.getOutputStream();
        //7.将FileInputStream流写入到buffer缓冲区
        while ((len = in.read(buffer)) > 0) {
            //8.使用OutputStream将缓冲区的数据输出到客户端浏览器
            out.write(buffer, 0, len);
        }
        in.close();
    }

    public JSONObject getQiniuUploadToken() {
        String token = qiniuHelper.getUploadToken();
        JSONObject data = new JSONObject();
        data.put("token", token);
        data.put("host", qiniuHelper.getHost());
        return data;
    }

}
