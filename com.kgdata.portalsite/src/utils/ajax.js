import axios, {AxiosInstance} from 'axios';
import { message } from 'antd';
import baseUrl from '../../config/url.config';

let ajax = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
       'Content-Type':'application/json;charset=utf-8',
       'Accept': 'application/json;charset=utf-8'
    },
    withCredentials: true
})
// const CancelToken = axios.CancelToken;
// const source = CancelToken.source();
// window.requestCancel = source.cancel; // 保存到全局变量，用于路由切换时调用

ajax.interceptors.request.use(
    (config) => {
        let userInfoStr = localStorage.getItem('user_info') || null;
        if(userInfoStr){
            let userInfo = JSON.parse(userInfoStr);
            config.headers['x-auth-token'] =  userInfo.userId + '&&' + userInfo.token;
        } else {
            message.warn('用户信息丢失，请重新登录');
            setTimeout(() => {
                window.location.href = '/';
            },1000)
        }

        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

ajax.interceptors.response.use(
    (config) => {
        if (config.data.code === 2) {
            // token is expired
            message.warn(config.data.message);
      
            setTimeout(() => {
              window.location.href = '/';
            }, 1000);
            return Promise.reject()
        } 
        return config;
    },
    (error) => {
        if(error.response.status == 404) {
            message.warn('接口可能在外星! 404!')
        } else if(error.response.status == 500) {
            message.warn('服务器被外星人劫持，请报警！ error_code 500!')
        } else {
            message.warn(error.response.statusText + ''+ error.response.status)
        }
        return Promise.reject(error.response)
    }
)

export default ajax;