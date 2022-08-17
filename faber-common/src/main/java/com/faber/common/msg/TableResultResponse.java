package com.faber.common.msg;

import com.faber.common.vo.DictOption;
import com.github.pagehelper.PageInfo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 基本的Table Response返回父类
 */
public class TableResultResponse<T> extends BaseResponse {

    TableData<T> data;

    @Deprecated
    public TableResultResponse(long total, List<T> rows) {
        this.data = new TableData<T>(total, rows);
    }

    public TableResultResponse(Pagination pagination, List<T> rows) {
        this.data = new TableData<T>(pagination, rows);
    }

    public TableResultResponse(PageInfo pageInfo) {
        this.data = new TableData<T>(pageInfo);
    }

    public TableResultResponse() {
        this.data = new TableData<T>();
    }

    TableResultResponse<T> total(int total) {
        this.data.setTotal(total);
        return this;
    }

    TableResultResponse<T> total(List<T> rows) {
        this.data.setRows(rows);
        return this;
    }

    public TableData<T> getData() {
        return data;
    }

    public void setData(TableData<T> data) {
        this.data = data;
    }

    public TableResultResponse<T> addDict(String column, List<DictOption> dictOptions) {
        this.getData().addDict(column, dictOptions);
        return this;
    }

    public static class TableData<T> {
        Pagination pagination;
        long total;
        List<T> rows;
        Map<String, List<DictOption>> dicts = new HashMap<>();

        @Deprecated
        public TableData(long total, List<T> rows) {
            this.total = total;
            this.rows = rows;
        }

        public TableData(Pagination pagination, List<T> rows) {
            this.total = pagination.getTotal();
            this.pagination = pagination;
            this.rows = rows;
        }

        public TableData(PageInfo pageInfo) {
            Pagination pagination = new Pagination();
            pagination.setTotal(pageInfo.getTotal());
            pagination.setPageSize(pageInfo.getPageSize());
            pagination.setCurrent(pageInfo.getPageNum());
            this.total = pageInfo.getTotal();
            this.rows = pageInfo.getList();
            this.pagination = pagination;
        }

        public TableData() {
        }

        public TableData<T> addDict(String column, List<DictOption> dictOptions) {
            if (dicts == null) dicts = new HashMap<>();
            dicts.put(column, dictOptions);
            return this;
        }

        public long getTotal() {
            return total;
        }

        public void setTotal(long total) {
            this.total = total;
        }

        public List<T> getRows() {
            return rows;
        }

        public void setRows(List<T> rows) {
            this.rows = rows;
        }

        public Map<String, List<DictOption>> getDicts() {
            return dicts;
        }

        public void setDicts(Map<String, List<DictOption>> dicts) {
            this.dicts = dicts;
        }

        public Pagination getPagination() {
            return pagination;
        }

        public void setPagination(Pagination pagination) {
            this.pagination = pagination;
        }
    }


    public static class Pagination {
        private long total;
        private int pageSize;
        private int current;

        public long getTotal() {
            return total;
        }

        public void setTotal(long total) {
            this.total = total;
        }

        public int getPageSize() {
            return pageSize;
        }

        public void setPageSize(int pageSize) {
            this.pageSize = pageSize;
        }

        public int getCurrent() {
            return current;
        }

        public void setCurrent(int current) {
            this.current = current;
        }
    }
}
