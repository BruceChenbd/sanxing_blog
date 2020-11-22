import React from 'react';
import './index.scss';
import { Form, Input, Button, Card, message, Checkbox, Icon } from 'antd';
import { observer } from 'mobx-react';
import { login, regist } from '../../server/index';
import background from '../../images/background.jpg';
import UserStore from '../../mobx/userStore';
import style from '../../style/global.scss';



@observer
class loginAndRegist extends React.Component {
    state = {
        isLogin: true
    }

    componentDidMount() {

    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.isLogin) {
                    let opt = {
                        userName: values.username,
                        password: values.password
                    }
                    login(opt).then(res => {
                        if (res.data.code == 0) {
                            const userObj = {
                                userName: res.data.data.username,
                                userId: res.data.data.userId,
                                token: res.data.data.token,
                                remember: values.remember,
                                password: values.remember ? values.password: ''
                            }
                            UserStore.setUserInfo(userObj);
                            localStorage.setItem('user_info', JSON.stringify(userObj));
                            message.success('登录成功！')
                            this.props.history.push('/Dashboard')
                        } else {
                            if (res.data && res.data.message) {
                                message.warn(res.data.message)
                            }
                        }
                    })
                } else {
                    let opt = {
                        userName: values.username,
                        password: values.password,
                        type:'admin'
                    }
                    // if (values.password !== values.passwordRe) {
                    //     message.warn('两次输入的密码不一致！')
                    //     return false
                    // }
                    regist(opt).then(res => {
                        console.log(res,'res')
                        if (res.data.code == 0) {
                            message.success('注册成功！')
                            this.setState({
                                isLogin: true
                            })
                        } else {
                            if (res.data && res.data.message) {
                                message.warn(res.data.message)
                            }
                        }
                    })
                }
            }
        });
    };
    hanleTab = e => {
        if (e.target.innerHTML === '登录') {
            this.setState({
                isLogin: true
            })
        } else {
            this.setState({
                isLogin: false
            })
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const styleObj = {
            width: "100%",
            height: "100%",
            backgroundImage: `url(${background})`,
            backgroundColor: 'rgba(0,51,0,0.8)',
            backgroundSize: 'cover',
        }
        let userPwdStr = localStorage.getItem('user_info'),userPwdObj = { username: '', password: '', remember: false };
        userPwdStr = JSON.parse(userPwdStr);
        if (userPwdStr && userPwdStr.remember) {
            userPwdObj = userPwdStr
        }
        return (
            <div className="login-wrap" style={styleObj}>
                <div className="login-center">
                    <div className="loginTitle">
                        SANXING 三省
                    </div>
                    <Card id="login-menu" style={{ width: '400px', margin: '0px auto 0px auto', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0)', zIndex: 1 }}>
                        <Form className="login-form" onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                {getFieldDecorator('username', {
                                    initialValue: userPwdObj.userName || '',
                                    rules: [{ required: true, message: '请输入用户名!' }],
                                })(
                                    <Input
                                        id="username"
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="用户名"
                                        autoComplete = "off"
                                        style={{width: 336}}
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    initialValue: userPwdObj.password || '',
                                    rules: [{ required: true, message: '请输入密码!' }],
                                })(
                                    <Input
                                        id="password"
                                        type="password"
                                        autoComplete = "off"
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="密码"
                                        style={{width: 336}}
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('remember', {
                                    initialValue: userPwdObj.remember,
                                    valuePropName: 'checked',
                                    initialValue: userPwdObj.remember
                                })(
                                    <Checkbox style={{ color: '#fff' }}>记住密码</Checkbox>
                                )}
                            </Form.Item>
                            <Button type="primary" style={{ width: '336px', background: style.mainColor, border: 'none', borderRadius: 0, color: '#fff' }} htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form>
                    </Card>

                </div>
            </div>
        )
    }
}
export default Form.create()(loginAndRegist)