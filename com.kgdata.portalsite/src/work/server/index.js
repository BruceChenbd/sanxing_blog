import axios from 'axios';
import ajax from '../../utils/ajax';
import fetch from '../../utils/fetch';


const login = (opt) => {
    return axios({method: 'POST',url:'/api/users/login',headers:{
        'Content-Type':'application/json;charset=utf-8',
        'Accept': 'application/json;charset=utf-8'
    },data:opt})
}

const regist = (opt) => {
    return axios({method: 'POST',url:'/api/users/regist',headers:{
        'Content-Type':'application/json;charset=utf-8',
        'Accept': 'application/json;charset=utf-8'
    },data:opt})
}

//文章新增
const addArticle =(opt) => ajax({method: 'POST', url: '/api/manage/addArticle', data: opt})

//文章封面
const uploadArticleImg = (opt) => ajax({method: 'POST', url: '/api/manage/upload', data: opt})

// 文章编辑器图片上传
const uploadEditImg = (opt) => ajax({method: 'POST', url: '/api/manage/uploadEdit', data: opt})

// 获取文章列表
const getArticleList = (opt) => ajax({method: 'GET', url: '/api/manage/getArticleList', params: opt})

// 删除文章
const deleteArticle = (opt) => ajax({method:'delete', url: `/api/manage/deleteArticle/${opt}`})

//设置文章可见与否
const setVisible = (opt) => ajax({method: 'POST', url: '/api/manage/setVisible', data: opt})

//查询文章详情
const getArticleInfo = (opt) => ajax({method: 'GET', url: `/api/manage/getArticleInfo/${opt}`})

// 更新文章
const updateArticle = (opt) => ajax({method: 'POST', url: '/api/manage/updateArticle', data: opt})

// 图说生活
const uploadPicture = (opt) => ajax({method: 'POST', url: '/api/manage/uploadPicture', data: opt})

// 图说保存
const saveImgList = (opt) => ajax({method: 'POST', url: '/api/manage/saveImgList', data: opt})

// 查询图片数组
const queryImgs = (opt) => ajax({method: 'GET', url: '/api/manage/getPictureList', params: opt})
export {
    login,
    regist,
    addArticle,
    uploadArticleImg,
    uploadEditImg,
    getArticleList,
    deleteArticle,
    setVisible,
    getArticleInfo,
    updateArticle,
    uploadPicture,
    saveImgList,
    queryImgs
}
