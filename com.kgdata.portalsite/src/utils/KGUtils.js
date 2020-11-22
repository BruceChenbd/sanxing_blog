import moment from 'moment';

export default function genID(length) {
  return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
}

export function generateUUID() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;

}

export function conver(limit) {
  var size = "";
  if (limit < 0.1 * 1024) { //如果小于0.1KB转化成B
    size = limit.toFixed(2) + "B";
  } else if (limit < 0.1 * 1024 * 1024) {//如果小于0.1MB转化成KB
    size = (limit / 1024).toFixed(2) + "KB";
  } else if (limit < 0.1 * 1024 * 1024 * 1024) { //如果小于0.1GB转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + "MB";
  } else { //其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }

  var sizestr = size + "";
  var len = sizestr.indexOf("\.");
  var dec = sizestr.substr(len + 1, 2);
  if (dec == "00") {//当小数点后为00时 去掉小数部分
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
  }
  return sizestr;
}

export function getUrlParam(param) {
  let url = window.location.hash;
  if (url && url.indexOf('?') > 0) {
    let paramString = url.split('?')[1];
    let paramArray = paramString.split('&');
    for (let item of paramArray) {
      let key_value = item.split('=');
      if (key_value[0] === param) {
        return key_value[1];
      }
    }
  }
}

export function getDataValue(value, type) {
  if (value && type && type.toLowerCase() === 'date') {
    return moment(Number(value)).format("YYYY-MM-DD HH:mm:ss")
  }
  return value;
}

export function getTimestampStr(number) {
  let ret = "";
  if (number && number > 0) {
    let date = moment(number);
    ret = date.format('YYYY-MM-DD HH:mm:ss');
  }
  return ret;
}

export function getTimestamp1000Str(number) {
  return getTimestampStr(number * 1000);
}

export function getStringValue(str) {
  if (str && str.length > 0) {
    let value = 0;
    for (let i = 0; i < str.length; i++) {
      value += str.charCodeAt(i);
    }
    value += str.length * 10000;
    return value;
  } else {
    return 0;
  }
}

export function filterChild(data) {
  let ret = [];
  if (data && data.length > 0) {
    let map = new Map();
    for (let item of data) {
      if (item.id.length === 32) {
        map.set(item.id, item);
      }
    }
    for (let item of data) {
      if (item.id.length === 32) {
        filter(item.children, map);
      }
    }
    ret = map.values();
  }
  return ret
}

function filter(children, map) {
  if (children && children.length > 0) {
    for (let child of children) {
      map.delete(child.id);
      filter(child.children, map)
    }
  }
}

export function shuffle(a) {
  let len = a.length;
  for (let i = 0; i < len - 1; i++) {
    let index = parseInt(Math.random() * (len - i));
    let temp = a[index];
    a[index] = a[len - i - 1];
    a[len - i - 1] = temp;
  }
}

export function getLocalTime(nS) {
  if (!nS || nS === '') {
    return null;
  }
  let timestamp = Date.parse(new Date(nS));
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1)
    : date.getMonth() + 1) + '-';
  let D = date.getDate() + ' ';
  let h = date.getHours() + ':';
  let m = date.getMinutes() + ':';
  let s = date.getSeconds();
  return Y + M + D + h + m + s;
}

//过滤特殊字符
export function regex(str) {
  if (str) {
    let reg = /^[a-zA-Z0-9\u4e00-\u9fa5\_\s]+$/
    if (reg.test(str)) {
      return true
    }
  } else if (str === '') {
    return true
  }
  return false;
}

//过滤特殊字符
export function regexSearchCondition(str) {
  if (str) {
    let reg = /^[a-zA-Z0-9\u4e00-\u9fa5\_\s]+$/
    if (reg.test(str)) {
      return true
    }
  } else if (str === '') {
    return true
  }
  return false;
}

//过滤特殊字符
export function regexKeyWord(str) {
  if (str) {
    let reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{0,20}$/
    if (reg.test(str)) {
      return true
    }
  } else if (str === '') {
    return true
  }
  return false;
}

//url 正则匹配
export function regexURL(str) {
  if (str) {
    let reg = /^((http|https):\/\/)?(www)\.[A-Za-z0-9]+[\/=\?%\-&_~`@\':+!]*([^<>\"\"])*$/
    if (reg.test(str)) {
      return true
    }
  } else if (str === '') {
    return true
  }
  return false;
}

//判断是否是图片url,支持格式.jpg|.jpeg|.png|.bmp
export function isImageURL(str){
  if (str) {
    let reg = new RegExp('[a-zA-z]+://[^\\s]*(.jpg|.jpeg|.png|.bmp)');
    if (reg.test(str)) {
      return true
    }
  } else if (str === '') {
    return true
  }
  return false;
}


/**
 * 创建并下载文件 防止 闪烁
 * @param  {String} fileName 文件名
 * @param  {String} url  文件下载地址
 */
export function createAndDownloadFile(url, fileName) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  //设置请求头参数的方式,如果没有可忽略此行代码
  xhr.setRequestHeader("Authorization", 'Bearer ' + sessionStorage.getItem("token"));
  //设置响应类型为 blob
  xhr.responseType = 'blob';
  //关键部分
  xhr.onload = function (e) {
    //如果请求执行成功
    if (this.status == 200) {
      var blob = this.response;
      var a = document.createElement('a');
      // blob.type = "application/octet-stream";
      var url = window.URL.createObjectURL(blob);
      if (window.navigator.msSaveBlob) {
        try {
          window.navigator.msSaveBlob(blob, decodeURIComponent(xhr.getResponseHeader("content-disposition").split(";")[1].split("filename=")[1]))
        } catch (e) {
          console.log(e);
        }
      } else {
        a.href = url;
        a.download = decodeURIComponent(xhr.getResponseHeader("content-disposition").split(";")[1].split("filename=")[1]);
        document.body.appendChild(a); // 火狐浏览器 必须把元素插入body中
        a.click();
        document.body.removeChild(a);
        //释放之前创建的URL对象
        window.URL.revokeObjectURL(url);
      }
    }
  };
  //发送请求
  xhr.send();
}

/**
 * 上传文件前校验
 * @param  {String} file 文件名
 * @param  {Array} accept 允许得文件名数组
 */
export function checkBeforeFileUpload(file, accept) {
  // 函数式
  // return new Promise((resolve, reject) => {
  //   let fileName = file.name;
  //   let index = fileName.lastIndexOf(".");
  //   let suffix = fileName.substr(index + 1);

  //   if (accept.indexOf(suffix) === -1) {
  //     return reject(false)
  //   }
  //   return resolve(true);
  // });

  // 直接返回布尔值
  let fileName = file.name;
  let index = fileName.lastIndexOf(".");
  let suffix = fileName.substr(index + 1);
  if (fileName.length > 64) {
    return { tip: false, msg: '文件名太长' }
  }
  if (file.size > 20 * 1024 * 1024) {
    return { tip: false, msg: '文件最大20MB' }
  }
  if (accept.indexOf(suffix) === -1) {
    return { tip: false, msg: '不支持该类型文件' }
  }
  return { tip: true, msg: '' }
}
