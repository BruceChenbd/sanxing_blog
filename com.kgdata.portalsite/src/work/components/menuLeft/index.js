import React from 'react';
import { Menu,Icon } from 'antd';
import { NavLink } from 'react-router-dom';
import menuData from './menuConfig';
import { observer, inject } from 'mobx-react';
import './index.scss'
import style from '../../style/global.scss';
import down from '../../images/dowm.png';
import up from '../../images/up.png'
import UserStore from '../../mobx/userStore';

const SubMenu = Menu.SubMenu
@inject('UserStore')
@observer
class navLeft extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPath:'',
            userName: '用户名'
        }
        this.handleMenu = this.handleMenu.bind(this)
    }
    componentDidMount() {
        //获取菜单节点
       const MenuNode = this.renderMenu(menuData);
        //获取当前hash中的路径   
       let currentPath = window.location.hash.replace(/#|\?.*$/g, '');
       console.log(currentPath)
       if (currentPath.indexOf('-')> -1) {
           currentPath = currentPath.split('-')[0]
       }
       this.setState({
           currentPath,
           MenuNode
       })
    }
    // 递归渲染菜单节点
    renderMenu (data) {
       return data.map((item) => {
          if(item.children &&  item.child) {
              return (
                  <SubMenu  title={
                    <span>
                      {item.type? <Icon type={item.type} />:''}
                      <span>{item.title}</span>
                    </span>
                  } key={item.key}>
                      {this.renderMenu(item.children)}
                  </SubMenu>
              )
          } else {
              return <Menu.Item title={item.title} key={item.key}>
                 <NavLink to={item.key}>
                 {item.type? <Icon type={item.type} />:''} 
                    <span>{item.title}</span>
                 </NavLink>
              </Menu.Item>
          }
       })
    }
    // 点击菜单
    handleMenu ({item,key}) {
        if (key === '/Dashboard') {
            UserStore.setBack()
        }
        if (key === this.state.currentPath) {
            return false;
        }
        this.setState({
            currentPath:key
        })
    }
    render() {
        return (
            <div className="nav">
               <div className="logo">
                   {
                       this.props.collapsed ? '三省':
                      'SANSHENG 三省'
                   }
               </div>
               <div className="place_div"></div>
               <Menu
                 onClick={this.handleMenu}
                 selectedKeys={[this.state.currentPath]}
                 defaultOpenKeys={['/SysIndex']}
                 theme="dark"
                 mode="inline"
                 style={{background: style.menuBgColor}}
               >
                   {this.state.MenuNode}
               </Menu>
            </div>
        )
    }
}

export default navLeft;