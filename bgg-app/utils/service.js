import ajax from './ajax'


const test = (opt) => ajax({method: 'GET', url: '/api/users/getTecArticleList', params: opt})

const queryDetail = (opt) => ajax({method: 'GET', url: '/api/users/getDetail', params: opt})

const queryPicture = (opt) => ajax({method: 'GET', url: '/api/users/getPicture', params: opt})

const queryFrameList = (opt) => ajax({method: 'GET', url: '/api/users/getFrameList', params: opt})

export {
    test,
    queryDetail,
    queryPicture,
    queryFrameList
}