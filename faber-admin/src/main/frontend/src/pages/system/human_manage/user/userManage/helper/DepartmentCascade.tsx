import React from 'react';
import modelService from '@/services/admin/department';
import BaseCascader, { BaseCascaderProps } from '@/components/biz/base-cascader';
import Admin from '@/props/admin';

export interface DepartmentCascadeProps extends Omit<BaseCascaderProps<Admin.Department>, 'serviceApi'> {}

/**
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DepartmentCascade(props: DepartmentCascadeProps) {
  return <BaseCascader showRoot={false} serviceApi={modelService} placeholder="请选择部门" {...props} />;
}