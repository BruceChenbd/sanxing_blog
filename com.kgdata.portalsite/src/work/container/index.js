import React from 'react';
import NavLeft from '../components/menuLeft/index';
import { withRouter } from "react-router-dom";
import { Layout, Menu, Dropdown, Icon } from 'antd';
import { ConfigProvider } from 'antd';
import { observer, inject } from 'mobx-react';
import zhCN from 'antd/lib/locale-provider/zh_CN'
import './index.scss';
import UserStore from '../mobx/userStore'
import style from '../style/global.scss'

const { Content, Sider, Header } = Layout
@inject('UserStore')
@observer
class Admin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            collapsed: false,
            bread: ''
        }

    }
    componentWillMount() {
    }
    componetWill
    loginOut() {
        UserStore.clearUserInfo();
        window.location.href = '/'
    }
    toggle = () => {
        const { collapsed } = this.state;
        this.setState({
            collapsed: !collapsed
        })
    };
    // 更改主题色
    changeColor() {
        if (localStorage.getItem('sign') == 'green' || localStorage.getItem('sign') == null) {
            localStorage.setItem('sign', 'blue')
            this.props.UserStore.setTheme('blue')
            // 弹框头部颜色
            document.getElementsByTagName('body')[0].style.setProperty('--dialogBgColor', '#002050', 'important');
            document.getElementsByTagName('body')[0].style.setProperty('--mainColor', '#1682FF', 'important');
            document.getElementsByTagName('body')[0].style.setProperty('--borderColor', '#004DA6', 'important');
            document.getElementsByTagName('body')[0].style.setProperty('--dialogHeadBgColor', '#003078', 'important');
            document.getElementsByTagName('body')[0].style.setProperty('--headerBgColor', '#051535', 'important');
            document.getElementsByTagName('body')[0].style.setProperty('--menuBgColor', '#000A1E', 'important');
            document.getElementsByTagName('body')[0].style.setProperty('--tableBgColor', 'rgba(22,130,255,0.32)');
        } else {
            localStorage.setItem('sign', 'green')
            this.props.UserStore.setTheme('green')
            document.getElementsByTagName('body')[0].style.setProperty('--dialogBgColor', '#003300', 'important');
            document.getElementsByTagName('body')[0].style.setProperty('--mainColor', '#0C9C6E', 'important');
            document.getElementsByTagName('body')[0].style.setProperty('--borderColor', '#339900', 'important');
            document.getElementsByTagName('body')[0].style.setProperty('--dialogHeadBgColor', '#004400', 'important');
            document.getElementsByTagName('body')[0].style.setProperty('--headerBgColor', '#002200', 'important');
            document.getElementsByTagName('body')[0].style.setProperty('--menuBgColor', '#001100', 'important');
            document.getElementsByTagName('body')[0].style.setProperty('--tableBgColor', 'rgba(12,156,110,0.32)', 'important');
        }
    }
    // 点击菜单
    handleMenu({ item, key }) {
        if (key === '/Dashboard') {
            UserStore.setBack()
            UserStore.setShowDetail()
        }
        if (key === this.state.currentPath) {
            return false;
        }
        this.setState({
            currentPath: key
        })
    }
    render() {
        const { collapsed } = this.state;
        const { userInfo } = this.props.UserStore
        const menu = (<Menu>
            <Menu.Item>
                <a target="_blank" onClick={this.loginOut.bind(this)}>
                    退出
                        </a>
            </Menu.Item>
        </Menu>
        )
        return (
            
            <ConfigProvider locale={zhCN}>

                <Layout className="layout">

                    <Layout style={{ height: '100%' }}>
                        <Sider
                            trigger={null} collapsible collapsed={collapsed}
                            style={{ background: '#001100', minHeight: '100%', height: 'auto' }}>
                            <NavLeft collapsed={collapsed}></NavLeft>
                        </Sider>
                        <Layout style={{ background: style.mainBgColor, height: 'auto' }}>
                            <Header className="header" style={{
                                background: style.headerBgColor, display: 'flex', alignItems: 'center', padding: '0 24px', position: 'fixed', zIndex: 4, width: '100%',
                                boxShadow: '0 4px 4px rgba(0, 0, 0, 0.1)'
                            }}>
                                <Icon onClick={this.toggle} style={{ fontSize: '28px' }} type={collapsed ? 'menu-unfold' : 'menu-fold'} />
                                <div style={{ position: 'absolute', right: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <span style={{ cursor: 'poniter' }}>{ userInfo? userInfo.userName : 'admin'}</span>
                                </div>
                                <Dropdown overlay={menu}>
                                    <a style={{ position: 'absolute', right: '250px' }} className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                        操作
                                    </a>
                                </Dropdown>
                            </Header>
                            {/* <GlobalBreadcrumb /> */}
                            <Content
                                className="site-layout-background"
                                style={{
                                    margin: '88px 24px 24px 24px',
                                    minHeight: 280,
                                    overflow: 'scroll',
                                    background: '#fff'
                                }}
                            >
                                {this.props.children}
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>
            </ConfigProvider>
        )
    }
}

export default withRouter(Admin);
