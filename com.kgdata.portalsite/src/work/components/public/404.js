/**
 * Created by zengtao on 2017/5/19.
 */
import React, {Fragment, Component} from 'react';
import {
    Router,
    Route,
    Switch,
    Link
} from 'react-router-dom';
import {url_add} from '@config';
//本项目的模板页面


export default class NotFound extends Component {
    static defaultProps={

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // const {value} = nextProps;
        // 当传入的type发生变化的时候，更新state
        // if ("value" in nextProps && value !== prevState.value) {
        //     console.log(value)
        //     return {
        //         value,
        //     };
        // }
        return null;
    }

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    //移除
    componentWillUnmount(){
        //离开页面消除所有接口请求
        //window.requestCancel();
    }

    render() {
        const {} =this.props;
        const {} =this.state;
        return (
            <div className="not_found" style={{display:'flex',alignItems:'center',background:'#eee',height:'100vh',flexDirection:'column',justifyContent:'center'}}>
                <p style={{fontSize:'30px',textAlign: 'center'}}>出错啦！您访问的页面不存在或者无权限</p>
                <Link to={'/'}>返回登录页面</Link>
            </div>
        );
    }
}
