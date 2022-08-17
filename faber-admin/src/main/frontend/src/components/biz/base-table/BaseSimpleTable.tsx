import React, {createContext, useEffect, useState} from 'react';
import { sumBy, get } from 'lodash';
import { ClearOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, Button, Modal } from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import { showResponse } from '@/utils/utils';
import FaberTable from './FaberTable';

interface CProps {
  localData: boolean; // 是否本地数据[查询场景、字段配置]
}

export const BaseBizTableContext = createContext<CProps>({
  localData: false,
});

/**
 * 基础业务表格组件
 * 1. 带字段自定义配置展示功能
 */
export default function BaseSimpleTable<RecordType extends object = any>({
  showCheckbox = true,
  localData = false,
  columns,
  refreshList,
  batchDelete,
  renderCheckBtns = () => null,
  rowClickSelected,
  rowClickSingleSelected = true,
  onSelectedRowsChange,
  showBatchBelBtn = true,
  showTopTips,
  scrollY,
  keyName = "id",
  ...props
}: FaberTable.BaseTableProps<RecordType>) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  useEffect(() => {
    setSelectedRowKeys([]);
  }, [get(props, 'pagination.total'), get(props, 'pagination.current'), get(props, 'pagination.pageSize')]);

  /**
   * 解析表格自定义配置
   * @return { parseColumns, scrollWidthX }
   * parseColumns 解析用户配置解析后的自定义字段配置
   * scrollWidthX 解析表格宽度
   */
  const processColumns = () => {
    // 表格字段配置
    // 解析自定义配置
    const parseColumns = columns.filter((c) => c.tcRequired || c.tcChecked);
    // 计算table滚动width
    const scrollWidthX = sumBy(parseColumns, (n) => Number(n.width) || 200);

    return { parseColumns, scrollWidthX };
  };

  /** 批量删除Item */
  function handleBatchDelete() {
    Modal.confirm({
      title: '删除',
      content: `确认删除勾选中的 ${selectedRowKeys.length} 条数据？`,
      okText: '删除',
      okType: 'danger',
      onOk: async (close) => {
        if (batchDelete) {
          batchDelete(selectedRowKeys).then((res) => {
            showResponse(res, '批量删除');
            refreshList();
            close();
          });
        }
      },
    });
  }

  const { parseColumns, scrollWidthX } = processColumns();

  const rowSelection: TableRowSelection<RecordType> = {
    fixed: true,
    selectedRowKeys,
    onChange: (rowKeys) => {
      updateRowKeys(rowKeys);
    },
    // columnWidth: 30,
  };

  function updateRowKeys(rowKeys: any[]) {
    setSelectedRowKeys(rowKeys);
    if (onSelectedRowsChange) {
      onSelectedRowsChange(rowKeys);
    }
  }

  return (
    <BaseBizTableContext.Provider value={{ localData }}>
      <div>
        {showTopTips && (
          <div>
            {/* 多选删除 */}
            {selectedRowKeys.length > 0 && (
              <div style={{ padding: 8, display: 'flex', lineHeight: '32px' }}>
                <div style={{ marginRight: 12 }}>
                  已选中&nbsp;<a>{selectedRowKeys.length}</a>&nbsp;条数据
                </div>
                {showBatchBelBtn && (
                  <Button onClick={handleBatchDelete} type="text" icon={<DeleteOutlined />} style={{ color: 'red' }}>
                    删除
                  </Button>
                )}
                {renderCheckBtns(selectedRowKeys)}
                <Button onClick={() => updateRowKeys([])} type="text" icon={<ClearOutlined />}>
                  取消选中
                </Button>
              </div>
            )}
          </div>
        )}
        <div style={{ position: 'relative' }}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Table
            columns={parseColumns}
            rowSelection={showCheckbox ? rowSelection : undefined}
            scroll={{ x: scrollWidthX, y: scrollY }}
            onRow={(record) => ({
              onClick: () => {
                if (!rowClickSelected) return;
                const clickId = get(record, 'id');
                let newRowKey = [];
                if (rowClickSingleSelected) {
                  newRowKey = [clickId];
                } else {
                  if (selectedRowKeys.indexOf(clickId) > -1) {
                    newRowKey = selectedRowKeys.filter((i) => i === clickId);
                  } else {
                    newRowKey = [...selectedRowKeys, get(record, keyName)];
                  }
                }
                setSelectedRowKeys(newRowKey);
                if (onSelectedRowsChange) {
                  onSelectedRowsChange(newRowKey);
                }
              },
            })}
            {...props}
          />
        </div>
      </div>
    </BaseBizTableContext.Provider>
  );
}
