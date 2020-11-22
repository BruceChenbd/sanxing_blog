import * as React from 'react';
import { Breadcrumb } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import menuList from '../menuLeft/menuConfig';
import style from '../../style/global.scss'

import './index.scss';

class GlobalBreadcrumb extends React.Component {
   getBreadcrumbs = () => {
    let breadcrumbs = [];
    let location = this.props.history.location;
    menuList.forEach((item) => {
      if (item.key === location.pathname) {
        breadcrumbs.push({ path: item.key, name: item.title });
        console.log(breadcrumbs)
      } else if (location.pathname.indexOf(item.key) > -1) {
        breadcrumbs.push({ path: item.key, name: item.title });

        if (item.children) {
          for (let i = 0; i < item.children.length; i++) {
            let opt = item.children[i];
            if (opt.key === location.pathname || location.pathname.replace(/\d+/, ':id') === opt.key) {
              breadcrumbs.push({ path: opt.key, name: opt.title });
            }
          }
        }
      }
    });

    return breadcrumbs;
  };

  handleClick = (path) => {
    // this.props.setSelectedKeys([path]);
  };

 render() {
     console.log(this.getBreadcrumbs())
    return (
      <Breadcrumb style={{ margin: '64px 0 10px', padding: '10px 20px', background: style.headerBgColor }}>
        {this.getBreadcrumbs().map((item, index, total) => {
          if (index === total.length - 1) {
            return <Breadcrumb.Item  key={item.path}>{item.name}</Breadcrumb.Item>;
          }
          return (
            <Breadcrumb.Item key={item.path}>
              <Link onClick={() => this.handleClick(item.path)} to={item.path}>
                {item.name}
              </Link>
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    );
  }
}


export default withRouter(GlobalBreadcrumb);