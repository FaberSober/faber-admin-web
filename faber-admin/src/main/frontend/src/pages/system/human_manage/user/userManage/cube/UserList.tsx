import React, { useContext, useEffect, useImperativeHandle, useRef } from 'react';
import { get } from 'lodash';
import { RouteComponentProps } from '@reach/router';
import { DownloadOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space } from 'antd';
import { ShiroPermissionContainer } from '@/components/auth';
import BaseBizTable, { BaseTableUtils, FaberTable } from '@/components/base-table';
import modelService from '@/services/admin/user';
import Admin from '@/props/admin';
import UserModal from '../modal/UserModal';
import DepartmentCascade from "@/pages/system/human_manage/user/userManage/helper/DepartmentCascade";
import { UserContext } from '@/layout/UserSimpleLayout';
import { clearForm, useDelete, useExport, useTableQueryParams } from '@/utils/myHooks';

const serviceName = '用户';
const buzzModal = 'UserList-v2';

interface IProps extends RouteComponentProps {
  departmentId?: string;
}

function UserList({ departmentId }: IProps, ref: any) {
  const { user } = useContext(UserContext);
  const addModalRef = useRef<any | null>(null);
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setExtraParams, setSceneId, setConditionList, fetchPageList, loading, list, dicts, paginationProps } =
    useTableQueryParams<Admin.UserWeb>(
      modelService.page,
      { extraParams: { departmentId }, sorter: { field: 'crtTime', order: 'descend' } },
      serviceName
    );

  const [exporting, fetchExportExcel] = useExport(modelService.exportExcel, { ...queryParams, extraParams: { departmentId } });
  const [handleDelete] = useDelete<string>(modelService.remove, fetchPageList, serviceName);

  useEffect(() => setExtraParams({ departmentId }), [departmentId]);

  useImperativeHandle(ref, () => ({
    showAddModal: () => {
      addModalRef.current.showModal();
    },
  }));

  /** 生成表格字段List */
  function genColumns(): FaberTable.ColumnsProp<Admin.UserWeb>[] {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genSimpleSorterColumn('ID', 'id', 340, sorter, false),
      {
        ...BaseTableUtils.genSimpleSorterColumn('部门', 'departmentId', 200, sorter),
        render: (val: any, record: any) => record.departmentName,
        tcCondComponent: ({ index, value, callback, ...props }: FaberTable.TcCondProp) => (
          <DepartmentCascade value={value} onChangeWithItem={(v: any, item: any) => callback(v, index, get(item, 'name'))} {...props} />
        ),
      },
      BaseTableUtils.genSimpleSorterColumn('手机号', 'mobilePhone', 120, sorter),
      BaseTableUtils.genSimpleSorterColumn('账户', 'username', 100, sorter),
      BaseTableUtils.genSimpleSorterColumn('姓名', 'name', 100, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('角色', 'roleNames', 100, sorter),
        sorter: false,
      },
      {
        ...BaseTableUtils.genSimpleSorterColumn('职位', 'postName', 70, sorter, false),
        sorter: false,
      },
      BaseTableUtils.genDictSorterColumn('状态', 'status', 100, sorter, dicts, 'common_user_status'),
      BaseTableUtils.genDictSorterColumn('性别', 'sex', 100, sorter, dicts, 'common_sex'),
      BaseTableUtils.genSimpleSorterColumn('邮箱', 'email', 150, sorter, false),
      BaseTableUtils.genSimpleSorterColumn('地址', 'address', 200, sorter, false),
      BaseTableUtils.genSimpleSorterColumn('类型', 'type', 100, sorter, false),
      BaseTableUtils.genSimpleSorterColumn('描述', 'description', undefined, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (text: string, record: Admin.User) => (
          <Space>
            <ShiroPermissionContainer roleList={user.elements}>
              <UserModal title={`编辑${serviceName}信息`} record={record} fetchFinish={fetchPageList}>
                <a>
                  <EditOutlined />
                  编辑
                </a>
              </UserModal>
            </ShiroPermissionContainer>
            <BaseTableUtils.AuthDelBtn record={record} handleDelete={(r) => handleDelete(r.id)} elements={user.elements} permission={undefined} />
          </Space>
        ),
        width: 120,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ];
  }

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: 12 }}>
        <div style={{ display: 'flex' }}>
          <strong style={{ fontSize: '18px' }}>{serviceName}</strong>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <div>
            <Form form={form} layout="inline" onFinish={setFormValues}>
              <Form.Item name="mobilePhone" label="手机号">
                <Input placeholder="请输入手机号" />
              </Form.Item>
              <Form.Item name="name" label="姓名">
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Form>
          </div>

          <div>
            <Space>
              <Button onClick={() => form.submit()} loading={loading} icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={() => clearForm(form)} loading={loading}>
                重置
              </Button>
              <ShiroPermissionContainer roleList={user.elements}>
                <UserModal ref={addModalRef} title={`新增${serviceName}信息`} fetchFinish={fetchPageList} destroyOnClose={false} departmentId={departmentId}>
                  <Button icon={<PlusOutlined />} type="primary">
                    新增
                  </Button>
                </UserModal>
              </ShiroPermissionContainer>
              <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>
                导出
              </Button>
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
        showComplexQuery={false}
        showBatchBelBtn={false}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
      />
    </Card>
  );
}

export default React.forwardRef(UserList);
