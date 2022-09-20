import React from 'react';
import {PlusOutlined, SearchOutlined} from '@ant-design/icons';
import {Button, Card, Form, Input, Space} from 'antd';
import BaseBizTable, {BaseTableUtils, FaberTable} from '@/components/biz/base-table';
import {clearForm, useDelete, useTableQueryParams} from "@/utils/myHooks";
import modelService from '@/services/rbac/rbacUserRole';
import Rbac from '@/props/rbac';

const serviceName = '角色用户';
const buzzModal = 'RbacUserRoleList';

export default function RbacUserRoleList() {
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Rbac.RbacUserRoleRetVo>(modelService.pageVo, { sorter: { field: 'crtTime', order: "descend" } }, serviceName)

  const [handleDelete] = useDelete<number>(modelService.remove, fetchPageList, serviceName)

  /** 生成表格字段List */
  function genColumns():FaberTable.ColumnsProp<Rbac.RbacUserRoleRetVo>[] {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genSimpleSorterColumn('用户名称', 'name', 150, sorter),
      BaseTableUtils.genSimpleSorterColumn('用户账户', 'username', undefined, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, record) => (
          <Space>
            <BaseTableUtils.AuthDelBtn record={record} handleDelete={(r) => handleDelete(r.id)} permission={undefined} />
          </Space>
        ),
        width: 80,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ];
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: 12 }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <div>
            <Form form={form} layout="inline" onFinish={setFormValues}>
              <Form.Item name="name" label="用户名称">
                <Input placeholder="请输入用户名称" />
              </Form.Item>
            </Form>
          </div>

          <div>
            <Space>
              <Button onClick={() => form.submit()} loading={loading} icon={<SearchOutlined />}>查询</Button>
              <Button onClick={() => clearForm(form)} loading={loading}>重置</Button>
              <Button icon={<PlusOutlined />} type="primary">新增</Button>
            </Space>
          </div>
        </div>
      </div>

      <BaseBizTable
        buzzModal={buzzModal}
        columns={genColumns()}
        pagination={paginationProps}
        loading={loading}
        dataSource={list}
        rowKey={(item) => item.id}
        onChange={handleTableChange}
        refreshList={() => fetchPageList()}
        batchDelete={(ids) => modelService.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
        showComplexQuery={false}
      />
    </div>
  );
}
