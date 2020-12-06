import React from 'react'
import '../styles/header/header.less'
import { Menu } from 'antd'
import { withRouter } from 'next/router'
import Link from 'next/link'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
const { SubMenu } = Menu;

class Header extends React.Component {
    state = {
        currentPath: '',
        isShow: false
    }
    componentDidMount() {
        let pathName = this.props.router.pathname;
        if (pathName == '/bytalk/talkDetail') {
            pathName = '/bytalk'
        }
        if (pathName == '/detail') {
            pathName = '/'
        }
        let currentPath = pathName;
        this.setState({
            currentPath
        })
    }

    // 点击菜单
    handleMenu = ({ item, key }) => {
        if (key === this.state.currentPath) {
            return false;
        }
        this.state.currentPath = key
        this.setState({
            currentPath: this.state.currentPath
        })
    }
    clickMenu = () => {
        this.setState({
            isShow: !this.state.isShow
        })
    }
    render() {
        return (

            <div className="header">
                <a href="/" style={{display:'flex', alignItems:'center'}}>
                    <span className="en-logo">SANXING</span>
                    <span className="ch-logo">三省</span>
                </a>
                <Menu onClick={this.handleMenu} selectedKeys={[this.state.currentPath]} mode="horizontal">
                    <Menu.Item key="/">
                        <Link href="/">
                            <a>技术文章</a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/bytalk" >
                        <Link href="/bytalk">
                            <a>杂谈怪文</a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/myedit">
                        <Link href="/myedit">
                            <a>我爱剪辑</a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/mylife">
                        <Link href="/mylife">
                            <a>图说生活</a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/about">
                        <Link href="/about">
                            <a>联系我</a>
                        </Link>
                    </Menu.Item>
                </Menu>
                {
                    this.state.isShow ?
                        <CloseOutlined onClick={this.clickMenu} className="menu_mobile" style={{ fontSize: '28px', cursor: 'pointer' }} />
                        :
                        <MenuOutlined onClick={this.clickMenu} className="menu_mobile" style={{ fontSize: '28px', cursor: 'pointer' }} />

                }

                <div className="menu_mask" style={{ height: this.state.isShow ? '200px' : '0', 
                overflow: this.state.isShow? 'inherit':'hidden'}}>
                    <ul>
                        <li>
                            <Link href="/">
                                <a>技术文章</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/bytalk">
                                <a>杂谈怪文</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/myedit">
                                <a>我爱剪辑</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/mylife">
                                <a>图说生活</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/about"><a>
                            联系我</a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)