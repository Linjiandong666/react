import React, { Component } from 'react';
import {Input,Form} from "antd";
import  PropTypes from 'prop-types';


class UpdateCategoryNameForm extends Component {
  static propTypes={
    categoryName:PropTypes.string.isRequired
  };

  validator=(rule,value,callback)=>{
    //为空值
    if(!value){
      callback('修改名称不能为空，请重新输入~')
    } //没改，跟之前一样的
    else if (value===this.props.categoryName) {
      callback('请不要输入之前名称~');
    }//ojbk的
    else {
      callback()
    }
  };


  render() {
  const {getFieldDecorator} =this.props.form;
    return <Form>
      <Form.Item>
        {
          getFieldDecorator(
            'categoryName',
            {
              //使用初始化的值(接收的名字)
              initialValue:this.props.categoryName,
              //自定义规则
              rules:[{
                validator:this.validator
              }]
            }

          )(
            <Input />
          )
        }
      </Form.Item>
    </Form>;

  }
}

export default Form.create()(UpdateCategoryNameForm )