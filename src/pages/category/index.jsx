import React, { Component } from 'react';
import {Card, Button, Icon, Table, Modal, message} from 'antd';

import { reqCategories,reqAddCategory,reqUpdateCategoryName } from '../../api';
import MyButton from '../../components/my-button';
import './index.less';
import AddCategoryForm from './add-category-form';
import UpdateCategoryNameForm from './update-category-name';




export default class Category extends Component {
  //初始化状态
  state = {
    categories: [], // 一级分类列表
    isShowAddCategory:false,
    isShowUpdateCategoryName: false,
  };
  //没有点击修改名称时是没有值的，为了防止出现传递时报错，所以初始化为一个空对象（这样不报错，值为undefined）
  category={};


  async componentDidMount() {
    const result = await reqCategories('0');
    if (result) {
      this.setState({categories: result});
    }
  }


  //切换弹话框的显示（封装一个公共弹框函数，方便复用）
  toggleDisplay=(stateName,stateValue)=>{
    return ()=>{
      this.setState({
        [stateName]:stateValue
      })
    }
  };

  //添加品类函数
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

  //保存数据，且更新状态，可以打开弹话框
  saveCategory=(category)=>{
    return ()=>{
      this.category=category;
      this.setState({
        isShowUpdateCategoryName: true
      })
    }
};

  //在修改名称的对话框中，点击取消时，清空输入框的值且关闭对话框
  hideUpdateCategoryName=()=>{
    this.updateCategoryNameForm.props.form.resetFields(['categoryName']);

    this.setState({
      isShowUpdateCategoryName: false
    })
  };

//在修改名称的对话框中，点击确定时，校验表单，收集数据，发送请求，清空输入框的值且关闭对话框
  updateCategoryName=()=>{
    //结构赋值，提升性能
    const {form}=this.updateCategoryNameForm.props;

    form.validateFields(async (err,values)=>{
      if (!err){
        const {categoryName}=values;
        const categoryId=this.category._id;
        const result=await reqUpdateCategoryName(categoryId,categoryName);

        if (result){
          //在不修改原数据的情况下，将修改后的名字显示到表格上
          const categories=this.state.categories.map((category)=>{
            let {_id,name,parentId}=category;
            if (_id===categoryId){
              name=categoryName;
              return{
                _id,
                name,
                parentId
              }
            }
            return category
          });

          form.resetFields(['categoryName']);
          message.success('更新名称成功~', 1);
          this.setState({
            isShowUpdateCategoryName: false,
            categories
          })
        }
      }
    });
  };


  render() {

    const {isShowAddCategory,categories,isShowUpdateCategoryName} =this.state;
    // 决定表头内容
    const columns = [
      {
        title: '品类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        // dataIndex: 'operation',
        className: 'category-operation',
        // 改变当列的显示
        render: category => {
          return <div>
            <MyButton onClick={this.saveCategory(category)}>修改名称</MyButton>
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


    return <Card title="一级分类列表" extra={<Button type="primary" onClick={this.toggleDisplay('isShowAddCategory',true)}><Icon type="plus" />添加品类</Button>}>
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
        onCancel={this.toggleDisplay('isShowAddCategory',false)}
        okText="确认"
        cancelText="取消"
      >
        <AddCategoryForm   categories={categories} wrappedComponentRef={(form) => this.addCategoryForm = form}/>
      </Modal>

      <Modal
        title="更新分类"
        visible={isShowUpdateCategoryName}
        onOk={this.updateCategoryName}
        onCancel={this.hideUpdateCategoryName}
        okText="确认"
        cancelText="取消"
        width={300}
      >
        <UpdateCategoryNameForm categoryName={this.category.name}  wrappedComponentRef={(form) => this.updateCategoryNameForm = form}/>
      </Modal>

    </Card>;
  }
}