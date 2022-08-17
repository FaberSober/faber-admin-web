package com.faber.common.vo;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Ace on 2017/6/12.
 */
@Data
public class TreeNode<T extends Object> {
    protected Object id;
    protected Object parentId;
    private String name;
    private Integer sort;
    private boolean hasChildren;
    List<TreeNode<T>> children = new ArrayList<TreeNode<T>>();

    private T sourceData;

    public void add(TreeNode<T> node){
        if (children == null) children = new ArrayList<>();
        children.add(node);
    }

}
