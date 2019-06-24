import React, { Component } from 'react';
import {getItem,removeItem} from "../../utils/storage-tools";
import MyButton from '../my-button';
import { Modal } from 'antd';
import './index.less';
import {withRouter} from 'react-router-dom';
//处理时间的库
import dayjs from 'dayjs';
import {reqWeather} from "../../api";


class HeaderMain extends Component {

  state={
    sysTime:Date.now(),
    weather: '晴',
    weatherImg: 'http://api.map.baidu.com/images/weather/day/qing.png'
  };


 async componentDidMount() {
   //更新时间
    setInterval(()=>{
      this.setState({
        sysTime:Date.now()
      })
    },1000);

    //更新天气
    const result=await reqWeather();
    if(result){
      this.setState(result);
    }
  }

  //得到用户名展示(一次即可)
  componentWillMount() {
    this.username=getItem().username;
  };


  //退出登录
  logout=()=>{
    Modal.confirm({
      title: '您确认要退出登录吗？',
      okText: '确认',
      cancelText: '取消',
      //此处要改为箭头函数解决this指向问题
      onOk:()=>{
        //点击确定清空location的数据
        removeItem();
        //点击确定就退出到登录页面(this和history要注意)
        this.props.history.replace('/login');
      },
    });
  };



  render() {
    const {systime,weather,weatherImg}=this.state;

    return <div>
      <div className="header-main-top">
        <span>欢迎, {this.username}</span>
        <MyButton onClick={this.logout}>退出</MyButton>
      </div>
      <div className="header-main-bottom">
        <span className="header-main-left">用户管理</span>
        <div className="header-main-right">
          <span>{dayjs(systime).format('YYYY-MM-DD HH:mm:ss')}</span>
          <img src={weatherImg}/>
          <span>{weather}</span>
        </div>
      </div>
    </div>;
  }
}



//让HeaderMain拥有路由组件的三大属性
export default withRouter(HeaderMain);