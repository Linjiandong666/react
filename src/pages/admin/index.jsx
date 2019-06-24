import React, { Component } from 'react';
import { Layout } from 'antd';
import { Route, Switch, Redirect } from 'react-router-dom';

import Home from '../home';
import Category from '../category';
import Product from '../product';
import User from '../user';
import Role from '../role';
import Line from '../charts/line';
import Bar from '../charts/bar';
import Pie from '../charts/pie';

import LeftNav from '../../components/left-nav';
import HeaderMain from '../../components/header-main';
import {getItem} from "../../utils/storage-tools";
import {reqValidateUserInfo} from '../../api/index';


const { Header, Content, Footer, Sider } = Layout;

export default class Admin extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

 async componentWillMount() {

    const user=getItem();

    if (user && user._id ) {
      const result = await reqValidateUserInfo(user._id);
      if (result) return;
    }

   this.props.history.replace('/login');
  }


  render() {
    const { collapsed } = this.state;

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <LeftNav collapsed={collapsed}/>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0, minHeight: 100 }}>
            <HeaderMain />
          </Header>
          <Content style={{ margin: '25px 16px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Switch>
                <Route path="/home" component={Home}/>
                <Route path="/category" component={Category}/>
                <Route path="/product" component={Product}/>
                <Route path="/user" component={User}/>
                <Route path="/role" component={Role}/>
                <Route path="/charts/line" component={Line}/>
                <Route path="/charts/bar" component={Bar}/>
                <Route path="/charts/pie" component={Pie}/>
                <Redirect to="/home"/>
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            推荐使用谷歌浏览器，可以获得更佳页面操作体验
          </Footer>
        </Layout>
      </Layout>
    );
  }
}