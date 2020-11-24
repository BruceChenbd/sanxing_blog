import ajax from './ajax'

const queryList = (opt) => ajax({method: 'GET',url: '/api/public/getArticleList', params: opt})

const test = (opt) => ajax({method: 'GET', url: 'http://localhost:18080/getTecArticleList', params: opt})

const queryDetail = (opt) => ajax({method: 'GET', url: 'http://localhost:18080/getDetail', params: opt})

const queryPicture = (opt) => ajax({method: 'GET', url: 'http://localhost:18080/getPicture', params: opt})

export {
    queryList,
    test,
    queryDetail,
    queryPicture
}