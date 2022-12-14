package com.faber.admin.config.quartz;

import cn.hutool.core.date.DateUnit;
import cn.hutool.core.date.DateUtil;
import com.faber.admin.biz.JobLogBiz;
import com.faber.admin.entity.JobLog;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.util.Date;

@Slf4j
public abstract class BaseJob implements Job {

    @Resource
    private JobLogBiz jobLogBiz;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        log.info("{}：启动任务=======================", this.getClass().getSimpleName());
        int jobId = context.getJobDetail().getJobDataMap().getIntValue("jobId");
        JobLog jobLog = this.createLog(jobId);

        try {
            run();

            // execute finish
            jobLog.setEndTime(new Date());
            jobLog.setDuration(DateUtil.between(jobLog.getEndTime(), jobLog.getBeginTime(), DateUnit.SECOND));
            jobLog.setStatus(JobLog.Status.DONE.value);
            jobLogBiz.updateById(jobLog);
        } catch (Exception e) {
            log.error(e.getMessage(), e);

            // log error
            jobLog.setEndTime(new Date());
            jobLog.setDuration(DateUtil.between(jobLog.getEndTime(), jobLog.getBeginTime(), DateUnit.SECOND));
            jobLog.setStatus(JobLog.Status.ERROR.value);
            jobLog.setErrMsg(e.getMessage());
            jobLogBiz.updateById(jobLog);
        }

        log.info(printNextFireTime(context));
    }

    protected abstract void run();

    protected JobLog createLog(int jobId) {
        JobLog jobLog = new JobLog();
        jobLog.setJobId(jobId);
        jobLog.setBeginTime(new Date());
        jobLog.setStatus(JobLog.Status.DOING.value);
        jobLog.setDuration(0L);
        jobLogBiz.save(jobLog);
        return jobLog;
    }

    protected String printNextFireTime(JobExecutionContext context) {
        if (context.getNextFireTime() != null) {
            return this.getClass().getSimpleName() + "：下次执行时间=====" +
                    new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
                            .format(context.getNextFireTime()) + "=======================";
        }
        return this.getClass().getSimpleName() + "：单次执行结束=======================";
    }

}
