import React, { Component } from 'react';
import {getItem,removeItem} from "../../utils/storage-tools";
import MyButton from '../my-button';
import { Modal } from 'antd';
import './index.less';
import {withRouter} from 'react-router-dom';
//处理时间的库
import dayjs from 'dayjs';
import {reqWeather} from "../../api";
import menuList from '../../config/menu-config';

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


  componentWillMount() {
    //得到用户名展示(一次即可)
    this.username=getItem().username;
    //初始化渲染在render前得到title
    this.title=this.getTitle(this.props);
    // console.log(this.title)
  };


  componentWillReceiveProps(nextProps) {
    //在setState前得到title，消除更新状态反复调用getTitle函数
    this.title=this.getTitle(nextProps);
    // console.log(this.title)
  }

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

  //获取title
  getTitle=(nextProps)=>{
    //获取地址路径
    const {pathname}=nextProps.location;
    //对一级菜单，二级菜单分别进行遍历，看key值是否能跟路径匹配，匹配就把菜单title赋值给初始化的title
    for (let i = 0; i < menuList.length; i++) {
      const menu=menuList[i];

      if(menu.children){

        for (let j = 0; j < menu.children.length; j++) {
          const item= menu.children[j];
          if(item.key===pathname){
            return item.title;
          }
        }

      } else {

        if(menu.key===pathname){
          return menu.title;
        }

      }
    }
  };



  render() {
    const {systime,weather,weatherImg}=this.state;

    return <div>
      <div className="header-main-top">
        <span>欢迎, {this.username}</span>
        <MyButton onClick={this.logout}>退出</MyButton>
      </div>
      <div className="header-main-bottom">
        <span className="header-main-left">{this.title}</span>
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