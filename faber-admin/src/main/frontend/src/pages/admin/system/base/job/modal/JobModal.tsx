import React, {useContext, useState} from 'react';
import {get} from 'lodash';
import {Form, Input} from 'antd';
import DragModal, {DragModalProps} from '@/components/modal/DragModal';
import {showResponse} from '@/utils/utils';
import {RES_CODE} from '@/configs/server.config';
import modelService from '@/services/admin/job';
import Admin from '@/props/admin';
import {CronModal} from "@/components/base-field";
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";


const formItemFullLayout = { labelCol: { span: 4 }, wrapperCol: { span: 19 } };

const serviceName = '系统定时任务';

interface IProps extends DragModalProps {
  title?: string;
  record?: Admin.Job;
  fetchFinish?: () => void;
}

/**
 * 系统定时任务实体新增、编辑弹框
 */
export default function JobModal({ children, title, record, fetchFinish, ...props }: IProps) {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [form] = Form.useForm();

  const [modalVisible, setModalVisible] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    modelService.add(params).then((res) => {
      showResponse(res, `新增${serviceName}`);
      setModalVisible(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    modelService.update(params.id, params).then((res) => {
      showResponse(res, `更新${serviceName}`);
      setModalVisible(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    return {
      jobName: get(record, 'jobName'),
      cron: get(record, 'cron', '0 * * * * ?'),
      clazzPath: get(record, 'clazzPath'),
      jobDesc: get(record, 'jobDesc'),
    }
  }

  function showModal() {
    setModalVisible(true)
    form.setFieldsValue(getInitialValues())
  }

  const loading = loadingEffect[modelService.getUrl('add')] || loadingEffect[modelService.getUrl('update')]
  return (
    <span>
      <span onClick={showModal}>{children}</span>
      <DragModal
        title={title}
        open={modalVisible}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => setModalVisible(false)}
        width={700}
        {...props}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="jobName" label="任务名称" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="cron" label="cron表达式" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input addonAfter={<CronModal initialValue={get(record, 'cron')} onChange={(v) => form.setFieldValue('cron', v)} />} />
          </Form.Item>
          <Form.Item name="clazzPath" label="任务执行方法" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="jobDesc" label="任务描述" {...formItemFullLayout}>
            <Input.TextArea maxLength={255} />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
