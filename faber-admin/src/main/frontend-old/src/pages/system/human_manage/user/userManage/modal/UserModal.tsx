import React, {useEffect, useImperativeHandle, useState} from 'react';
import { get } from 'lodash';
import {Button, Col, Form, Input, Row} from 'antd';
import DragModal, { DragModalProps } from '@/components/modal/DragModal';
import { showResponse } from '@/utils/utils';
import { RES_CODE } from '@/configs/server.config';
import modelService from '@/services/admin/user';
import groupUserApi from '@/services/admin/groupUser';
import Admin from '@/props/admin';
import DepartmentCascade from "@/pages/system/human_manage/user/userManage/helper/DepartmentCascade";
import { DictDataRadio } from '@/components/base-dict';
import GroupTreeSelect from "@/pages/system/human_manage/user/userManage/helper/GroupTreeSelect";
import {UploadImgLocal} from "@/components/base-uploader";

const formItemFullLayout = { labelCol: { span: 4 }, wrapperCol: { span: 19 } };

const serviceName = '用户';

interface IProps extends DragModalProps {
  // parentId?: string;
  title?: string;
  record?: Admin.User;
  fetchFinish?: () => void;
  departmentId?: string;
  addLoc?: { lng: number, lat: number },
}

/**
 * 用户实体新增、编辑弹框
 */
function UserModal({ children, title, record, fetchFinish, departmentId, addLoc, ...props }: IProps, ref: any) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    showModal: () => {
      setModalVisible(true);
    },
  }));

  // useEffect(() => {
  //   if (record !== undefined) {
  //     form.setFieldsValue({ departmentId });
  //   }
  // }, [departmentId]);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    setLoading(true);
    modelService
      .add(params)
      .then((res) => {
        showResponse(res, `新增${serviceName}`);
        if (res && res.status === RES_CODE.OK) {
          setModalVisible(false);
          if (fetchFinish) fetchFinish();
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    setLoading(true);
    modelService
      .update(params.id, params)
      .then((res) => {
        showResponse(res, `更新${serviceName}`);
        if (res && res.status === RES_CODE.OK) {
          setModalVisible(false);
          if (fetchFinish) fetchFinish();
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      // birthday: getDateStr000(fieldsValue.birthday),
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    return {
      name: get(record, 'name'),
      username: get(record, 'username'),
      mobilePhone: get(record, 'mobilePhone'),
      email: get(record, 'email'),
      departmentId: get(record, 'departmentId', departmentId),
      sex: get(record, 'sex'),
      status: get(record, 'status'),
      description: get(record, 'description'),
      post: get(record, 'post'),
      img: get(record, 'img', '/origin/api/admin/file/local/getFile/head'),
      lng: get(record, 'lng', addLoc?.lng),
      lat: get(record, 'lat', addLoc?.lat),
      groupIds: [],
    }
  }

  useEffect(() => {
    if (props.open) {
      initFormData()
    }
  }, [props.open])

  function showModal() {
    setModalVisible(true)
    initFormData()
  }

  function initFormData() {
    form.setFieldsValue(getInitialValues())
    if (record !== undefined) {
      groupUserApi.list({ userId: record.id }).then((res) => {
        if (res && res.status === RES_CODE.OK) {
          form.setFieldsValue({ groupIds: res.data.map((i) => i.groupId) })
        }
      });
    }
  }

  return (
    <span>
      <span onClick={() => showModal()}>{children}</span>
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
          <Form.Item name="departmentId" label="部门" rules={[{ required: true }]} {...formItemFullLayout}>
            <DepartmentCascade />
          </Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="username" label="账户" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="mobilePhone" label="手机号" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]} {...formItemFullLayout}>
            <DictDataRadio dictLabel="common_user_status" />
          </Form.Item>
          <Form.Item name="groupIds" label="角色" rules={[{ required: true }, { type: 'array', max: 1 }]} {...formItemFullLayout}>
            <GroupTreeSelect showRoot={false} multiple treeDefaultExpandAll extraParams={{ groupType: Admin.GroupTypeEnums.INNER }} />
          </Form.Item>
          <Form.Item name="email" label="邮箱" {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="sex" label="性别" {...formItemFullLayout}>
            <DictDataRadio dictLabel="common_sex" />
          </Form.Item>
          <Form.Item name="img" label="头像" {...formItemFullLayout}>
            <UploadImgLocal prefix="/head/img" />
          </Form.Item>
          <Form.Item name="description" label="备注" {...formItemFullLayout}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}

export default React.forwardRef(UserModal);
