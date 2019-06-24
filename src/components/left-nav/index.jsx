import React, { Component } from 'react';
import { Icon, Menu } from "antd";
import { Link,withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import './index.less';
import logo from '../../assets/images/logo.png';
import menuList from '../../config/menu-config';

const { SubMenu, Item } = Menu;

class LeftNav extends Component {
  static propTypes = {
    collapsed: PropTypes.bool.isRequired
  };

  createMenu = (menu) => {
    return <Item key={menu.key}>
      <Link to={menu.key}>
        <Icon type={menu.icon} />
        <span>{menu.title}</span>
      </Link>
    </Item>
  };

  componentWillMount() {
    const { pathname } = this.props.location;
    this.menus = menuList.map((menu) => {
      const children = menu.children;

      if (children) {
        return <SubMenu
          key={menu.key}
          title={
            <span>
              <Icon type={menu.icon} />
              <span>{menu.title}</span>
            </span>
          }
        >
          {
            children.map((item) => {
              if (item.key === pathname) {
                this.openKey = menu.key;
              }
              return this.createMenu(item);
            })
          }
        </SubMenu>;
      } else {
        return this.createMenu(menu);
      }
    });
    this.selectedKey = pathname;
  }

  render() {
    const { collapsed } = this.props;

    return <div>
      <Link className="left-nav-logo" to='/home'>
        <img src={logo} alt="logo"/>
        <h1 style={{display: collapsed ? 'none' : 'block'}}>硅谷后台</h1>
      </Link>
      <Menu theme="dark" defaultSelectedKeys={[this.selectedKey]} defaultOpenKeys={[this.openKey]} mode="inline">
        {
          this.menus
        }
      </Menu>
    </div>;
  }
}

export default withRouter(LeftNav);