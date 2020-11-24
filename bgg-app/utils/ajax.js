import axios from 'axios';
import { message } from 'antd';

let ajax = axios.create({
    baseURL: '',
    timeout: 10000,
    headers: {
       'Content-Type':'application/json;charset=utf-8',
       'Accept': 'application/json;charset=utf-8'
    },
    withCredentials: true
})

ajax.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

ajax.interceptors.response.use(
    (config) => {
        return config;
    },
    (error) => {
        console.log(error)
        // if(error.response.data.status == 404) {
        //     message.warn('找不到接口服务 404!')
        // } else if(error.response.data.status == 500) {
        //     message.warn('服务器发生未知错误 500!')
        // } else {
        //     message.warn(error.response.statusText + ''+ error.response.status)
        // }
        return Promise.reject(error.response)
    }
)

export default ajax;