import React, { Component } from 'react';
import {Card, Button, Icon, Table, Modal, message} from 'antd';

import { reqCategories } from '../../api';
import MyButton from '../../components/my-button';
import './index.less';
import AddCategoryForm from './add-category-form';
import {reqAddCategory} from '../../api/index';




export default class Category extends Component {
  state = {
    categories: [], // 一级分类列表
    isShowAddCategory:false
  };

  async componentDidMount() {
    const result = await reqCategories('0');
    if (result) {
      this.setState({categories: result});
    }
  }

  showAddCategory=()=>{
  this.setState({
    isShowAddCategory:true
  })
  };

  hideAddCategory=()=>{
    this.setState({
      isShowAddCategory:false
    })
  };

  addCategory = () => {
    // 1. 表单校验
    // 2. 收集表单数据
    //解构赋值优化代码
    const { form }=this.addCategoryForm.props;
    form.validateFields(async (err, values) => {
      if (!err) {
        // 校验通过
        const { parentId, categoryName } = values;
        const result = await reqAddCategory(parentId, categoryName);

        if (result) {
          // 提示添加分类成功~
          message.success('添加分类成功~', 2);

          //判断是否是一级分类，是则添加到最后去
          if (result.parentId==='0'){
            this.setState({
              categories:[...this.state.categories,result]
            })
          }

          //添加成功后清空input表单数据
          form.resetFields(['parentId','categoryName']);

          //关闭弹框
          this.setState({
            isShowAddCategory: false
          })
        }
      }
    })
    // 3. 发送请求


  };

  render() {

    const {isShowAddCategory,categories} =this.state;
    // 决定表头内容
    const columns = [
      {
        title: '品类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        className: 'category-operation',
        // 改变当列的显示
        render: text => {
          return <div>
            <MyButton>修改名称</MyButton>
            <MyButton>查看其子品类</MyButton>
          </div>
        },
      },
    ];

    // 决定表格里面数据
    /*const data = [
      {
        key: '1',
        categoryName: '手机',
        // operation: 'xxxxx',
      },
      {
        key: '2',
        categoryName: '电脑',
        // operation: 'yyyy',
      },
      {
        key: '3',
        categoryName: '耳机',
        // operation: 'zzzzzz',
      },
      {
        key: '4',
        categoryName: '鼠标',
        // operation: 'zzzzzz',
      },
    ];*/


    return <Card title="一级分类列表" extra={<Button type="primary" onClick={this.showAddCategory}><Icon type="plus" />添加品类</Button>}>
      <Table
        columns={columns}
        dataSource={categories}
        bordered
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['3', '6', '9', '12'],
          defaultPageSize: 3,
          showQuickJumper: true
        }}
        rowKey="_id"
      />

      <Modal
        title="添加分类"
        visible={isShowAddCategory}
        onOk={this. addCategory}
        onCancel={this.hideAddCategory}
        okText="确认"
        cancelText="取消"
      >
        <AddCategoryForm   categories={categories} wrappedComponentRef={(form) => this.addCategoryForm = form}/>
      </Modal>

    </Card>;
  }
}