import React, {useContext, useState} from 'react';
import {get} from 'lodash';
import {Form, Input, Select} from 'antd';
import DragModal from '@/components/modal/DragModal';
import {showResponse} from '@/utils/utils';
import modelService from '@/services/rbac/rbacMenu';
import Rbac from '@/props/rbac';
import FaEnums from "@/props/base/FaEnums";
import {BaseBoolIntRadio} from "@/components/base-dict";
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";
import RbacMenuCascader from "../helper/RbacMenuCascader";
import {Fa} from "@/props/base";

const formItemFullLayout = { labelCol: { span: 4 }, wrapperCol: { span: 19 } };

const serviceName = '菜单';

/**
 * BASE-权限表实体新增、编辑弹框
 */
export default function RbacMenuModal({ children, title, record, fetchFinish, ...props }: Fa.CommonModalProps<Rbac.RbacMenu>) {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [form] = Form.useForm();

  const [modalVisible, setModalVisible] = useState(false);
  const [parentItem, setParentItem] = useState<Rbac.RbacMenu|undefined>();

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
      linkUrl: record ? fieldsValue.linkUrl : `${parentItem? parentItem.linkUrl : ''}${fieldsValue.linkUrl}`,
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
      parentId: get(record, 'parentId'),
      name: get(record, 'name'),
      level: get(record, 'level'),
      icon: get(record, 'icon'),
      status: get(record, 'status', FaEnums.BoolEnum.YES),
      linkType: get(record, 'linkType', FaEnums.RbacLinkTypeEnum.INNER),
      linkUrl: get(record, 'linkUrl'),
    }
  }

  function showModal() {
    setModalVisible(true)
    form.setFieldsValue(getInitialValues())
  }

  const loading = loadingEffect[modelService.getUrl('add')] || loadingEffect[modelService.getUrl('update')];
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
          <Form.Item name="parentId" label="上级菜单" rules={[{ required: true }]} {...formItemFullLayout}>
            <RbacMenuCascader showRoot onChangeWithItem={(key, raw) => setParentItem(raw)} />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={[{ required: true }]} {...formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="level" label="菜单等级" rules={[{ required: true }]} {...formItemFullLayout}>
            <Select>
              <Select.Option value={FaEnums.RbacMenuLevelEnum.APP}>模块</Select.Option>
              <Select.Option value={FaEnums.RbacMenuLevelEnum.LEVEL_1}>一级菜单</Select.Option>
              <Select.Option value={FaEnums.RbacMenuLevelEnum.LEVEL_2}>二级菜单</Select.Option>
              <Select.Option value={FaEnums.RbacMenuLevelEnum.BUTTON}>按钮</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="是否启用" rules={[{ required: true }]} {...formItemFullLayout}>
            <BaseBoolIntRadio />
          </Form.Item>
          <Form.Item name="linkType" label="链接类型" rules={[{ required: true }]} {...formItemFullLayout}>
            <Select>
              <Select.Option value={FaEnums.RbacLinkTypeEnum.INNER}>内部链接</Select.Option>
              <Select.Option value={FaEnums.RbacLinkTypeEnum.OUT}>外部链接</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="linkUrl" label="链接地址" rules={[{ required: true }]} {...formItemFullLayout}>
            { record ? (<Input />) : <Input addonBefore={parentItem ? parentItem.linkUrl : undefined} /> }
          </Form.Item>
          <Form.Item name="icon" label="图标标识" rules={[{ required: false }]} {...formItemFullLayout}>
            <Input addonAfter={<a href="https://fontawesome.com/search" target="_blank">搜索图标</a>} />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  )
}
