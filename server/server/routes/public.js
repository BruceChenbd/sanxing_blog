var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const picturesSchema = require('../model/pictures');
const articleSchema = require('../model/article');
const videoSchema = require('../model/video');

const {
    responseClient,
} = require('../utils/utils');


// 查询我的剪辑详情
router.get('/getFrameDetail/:id', (req, res) => {
    let {
        id
    } = req.params;

    videoSchema.find({
        _id: id
    }).then(resp => {
        responseClient(res, 200, 0, '查询成功!', resp)
    }).catch(err => {
        responseClient(res)
    })
})
// 查询我的剪辑列表
router.get('/getFrameList', (req, res) => {
    let {
        key,
        pageNum
    } = req.query;
    let searchConditions = [];
    if (key) {
        searchConditions = [{
            title: eval("/" + key + "/")
        }, {
            url: eval("/" + key + "/")
        }]
    }
    let skip = (pageNum - 1) < 0 ? 0 : (pageNum - 1) * 5;

    // 查询条件 name 不为空 
    let data = {};
    // 查询总数
    if (JSON.stringify(req.query) == '{}' || searchConditions.length == 0) {
        videoSchema.countDocuments().then(count => {
            data.total = count;
            videoSchema.find().skip(skip).limit(5).then(d => {
                if (JSON.stringify(d) == '[]') {
                    data.articleArr = [];
                    responseClient(res, 200, 0, '暂无数据', data)
                } else {
                    data.articleArr = d;
                    responseClient(res, 200, 0, '查询成功', data)
                }
            })
        })
    } else {
        videoSchema.countDocuments({
            $or: searchConditions
        }).then(count => {
            data.total = count;
            videoSchema.find({
                $or: searchConditions
            }).skip(skip).limit(5).then(d => {
                if (JSON.stringify(d) == '[]') {
                    data.articleArr = [];
                    responseClient(res, 200, 0, '暂无数据', data)
                } else {
                    data.articleArr = d;
                    responseClient(res, 200, 0, '查询成功', data)
                }
            })
        })
    }
})



// 获取图片数组
router.get('/getPictureList', (req, res) => {
    picturesSchema.find().then(resp => {
        responseClient(res, 200, 0, '查询成功!', resp)
    }).catch(err => {
        responseClient(res)
    })

})



// 获取文章列表
router.get('/getArticleList', (req, res) => {
    let {
        key,
        pageNum
    } = req.query;
    let searchConditions = [];
    if (key) {
        searchConditions = [{
            title: eval("/" + key + "/")
        }, {
            category: eval("/" + key + "/")
        }]
    }

    let skip = (pageNum - 1) < 0 ? 0 : (pageNum - 1) * 5;
    // 查询条件 name 不为空 
    let data = {};
    // 查询总数
    if (JSON.stringify(req.query) == '{}' || searchConditions.length == 0) {
        articleSchema.countDocuments().then(count => {
            data.total = count;
            articleSchema.find().sort({
                createTime: '-1'
            }).skip(skip).limit(5).then(d => {
                if (JSON.stringify(d) == '[]') {
                    data.articleArr = [];
                    responseClient(res, 200, 0, '暂无数据', data)
                } else {
                    data.articleArr = d;
                    responseClient(res, 200, 0, '查询成功', data)
                }
            })
        })
    } else {
        articleSchema.countDocuments({
            $or: searchConditions
        }).then(count => {
            data.total = count;
            articleSchema.find({
                $or: searchConditions
            }).sort({
                createTime: '-1'
            }).skip(skip).limit(5).then(d => {
                if (JSON.stringify(d) == '[]') {
                    data.articleArr = [];
                    responseClient(res, 200, 0, '暂无数据', data)
                } else {
                    data.articleArr = d;
                    responseClient(res, 200, 0, '查询成功', data)
                }
            })
        })
    }
})


// 获取文章详情
router.get('/getArticleInfo/:id', (req, res) => {
    let {
        id
    } = req.params;
    articleSchema.find({
        _id: id
    }).then(resp => {
        responseClient(res, 200, 0, '查询成功!', resp)
    }).catch(err => {
        responseClient(res)
    })

})
/***文章管理 end */

router.get('/getRandNum', (req, res) => {
    let num = Math.random().toFixed(2) * 1000 + 600;
    let result = {};
    result.num = num;
    responseClient(res, 200, 0, result);
})
module.exports = router;