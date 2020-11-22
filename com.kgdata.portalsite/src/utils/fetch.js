import axios from 'axios'
import { Modal, message } from 'antd';
// import { baseUrl } from './config.js'

const service = axios.create({
  baseURL: '', // api的base_url
  timeout: 2000000, // request timeout
  withCredentials: true,
});

service.interceptors.request.use(config => {
  // 在发送请求之前做些什么
//   if (config.url && sessionStorage.getItem("token")) {
//     config.headers['Authorization'] = 'Bearer ' + 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJyb290IiwiYXV0aCI6IlJPT1QiLCJleHAiOjE1OTkyNzIwNzh9.HXP68gmncCiYurwfkdjOurkf84iJIAlZehPptZsxK14uy3W3R5kGcy4GiFIOUr18Dh9jx7D4kSvrTmGz4tHc6g';
//   }
//   if (config.url && sessionStorage.getItem("token")) {
    config.headers['Authorization'] = 'Bearer ' + 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJyb290IiwiYXV0aCI6IlJPT1QiLCJleHAiOjE1OTkyNzIwNzh9.HXP68gmncCiYurwfkdjOurkf84iJIAlZehPptZsxK14uy3W3R5kGcy4GiFIOUr18Dh9jx7D4kSvrTmGz4tHc6g';
//   }
  if (config.url.indexOf('authentication') === -1 && config.url.indexOf('/nlp') !== 0) {
    config.url = config.url
  }
  return config
}, error => {
  Promise.reject(error)
});
message.config({
  duration: 2,
  maxCount: 1,
})

service.interceptors.response.use(
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    response.headers['Access-Control-Allow-Credentials'] = 'true';
    response.headers['Access-Control-Allow-Origin'] = '*';
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With ';
    response.headers['Access-Control-Allow-Methods'] = 'PUT, POST, GET, DELETE, OPTIONS';

    let res = response.data;

    if (res.retCode > 900000) {
      Modal.error({
        title: "未知异常",
        content: "发生未知异常，代号：" + res.retCode + "，请将异常编号[" + res.exceptionId + "]发送给技术人员排查！"
      });
      return Promise.reject('error');
    }

    if (res.retCode == 33009) {
    //   message.error("用户未登陆或者登陆超时,即将跳转至登录页!", 2, () => {
    //     sessionStorage.clear();
    //     window.location.reload(true);
    //   });
      return Promise.reject('error');
    }

    if (res.retCode != 0) {
      message.error(res.message);
      return Promise.reject(res);
    }

    return response.data;

  },
  error => {
    if (error.response.status === 401) {
    //   message.error("用户未登陆或者登陆超时,即将跳转至登录页!", 2, () => {
    //     sessionStorage.clear();
    //     window.location.reload(true);
    //   });
    }
    return Promise.reject(error);
  });

export default service
