var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var sd = require('silly-datetime');
var jwt = require('jsonwebtoken');
const picturesSchema = require('../model/pictures');
const articleSchema = require('../model/article');
const {
    MD5_KEY,
    responseClient,
    md5,
    getDateStr
} = require('../utils/utils');

// 图说生活 /***start */
router.post('/uploadPicture', (req, res) => {
    let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
    let token = tokenAndUserId.split('&&')[1];
    let userId = tokenAndUserId.split('&&')[0];

    let secretOrPrivateKey = "bgg" + userId; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) { //  时间失效的时候 || 伪造的token
            responseClient(res, 200, 2, '身份验证失败，请重新登录!')
        } else {
            let COVER_UPLOAD_FOLDER = '/pictureSea';
            //创建上传表单
            var form = new formidable.IncomingForm();
            //设置编码格式
            form.encoding = 'utf-8';
            //设置上传目录
            form.uploadDir = './public' + COVER_UPLOAD_FOLDER;
            //保留后缀
            form.keepExtensions = true;
            //文件大小
            form.maxFieldsSize = 5 * 1024 * 1024;
            form.parse(req, function (err, fields, files) {
                let filesFile = files.file
                if (err) {
                    return res.json({
                        status: 500,
                        message: "内部服务器错误",
                        result: ''
                    })
                }
                // 限制文件大小 单位默认字节 这里限制大小为2m
                if (filesFile.size > form.maxFieldsSize) {
                    fs.unlink(filesFile.path, () => {})
                    return res.json({
                        data: {
                            data: {},
                            status: 1,
                            message: "图片大小不能超过2M",
                        }
                    })
                }
                //后缀名
                var extName = '';
                switch (filesFile.type) {
                    case 'image/pjpeg':
                        extName = 'jpg';
                        break;
                    case 'image/jpeg':
                        extName = 'jpg';
                        break;
                    case 'image/png':
                        extName = 'png';
                        break;
                    case 'image/x-png':
                        extName = 'png';
                        break;
                }
                if (extName.length == 0) {
                    return res.json({
                        data: {
                            data: {},
                            status: 1,
                            message: "只支持png和jpg格式图片",
                        }
                    })
                }
                //使用第三方模块silly-datetime
                var t = sd.format(new Date(), 'YYYYMMDDHHmmss');
                //生成随机数
                var ran = parseInt(Math.random() * 8999 + 10000);
                // 生成新图片名称
                var avatarName = t + '_' + ran + '.' + extName;
                // 新图片路径
                var newPath = form.uploadDir + '/' + avatarName;
                // 更改名字和路径
                fs.rename(filesFile.path, newPath, function (err) {
                    if (err) {
                        return res.json({
                            "code": 401,
                            "message": "图片上传失败"
                        })
                    } else {
                        return res.json({
                            data: {
                                // 生产环境要修改此处
                                data: 'http://127.0.0.1:3200' + COVER_UPLOAD_FOLDER + '/' + avatarName,
                                status: 0,
                                message: "图片上传成功",
                            }
                        })
                    }
                })
            })
        }
    })
})

// 图说生活 保存图片数组
router.post('/saveImgList', (req, res) => {
    let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
    let token = tokenAndUserId.split('&&')[1];
    let userId = tokenAndUserId.split('&&')[0];

    let secretOrPrivateKey = "bgg" + userId; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) { //  时间失效的时候 || 伪造的token
            responseClient(res, 200, 2, '身份验证失败，请重新登录!')
        } else {
            picturesSchema.findOne({userId}).then(p => {
                if(p) {
                    picturesSchema.update({
                        userId
                    }, {
                        pictureList: req.body
                    }).then(u => {
                        responseClient(res, 200, 0, '更新成功!')
                    }).catch(err => {
                        responseClient(res)
                    })
                } else {
                    let model = new picturesSchema({
                        userId,
                        pictureList: req.body
                    })
                    model.save().then(data => {
                        responseClient(res, 200, 0, '保存成功!')
                    }).catch(err => {
                        responseClient(err)
                    })
                }
            })
           
        }
    })
})

// 获取图片数组
router.get('/getPictureList', (req, res) => {
    let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
    let token = tokenAndUserId.split('&&')[1];
    let userId = tokenAndUserId.split('&&')[0];

    let secretOrPrivateKey = "bgg" + userId; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) { //  时间失效的时候 || 伪造的token
            responseClient(res, 200, 2, '身份验证失败，请重新登录!')
        } else {
            picturesSchema.find({
                userId
            }).then(resp => {
                responseClient(res, 200, 0, '查询成功!', resp)
            }).catch(err => {
                responseClient(res)
            })
        }
    })
   
})

/***文章管理 start */
// 上传封面图片
router.post('/upload', (req, res) => {
    let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
    let token = tokenAndUserId.split('&&')[1];
    let userId = tokenAndUserId.split('&&')[0];

    let secretOrPrivateKey = "bgg" + userId; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) { //  时间失效的时候 || 伪造的token
            responseClient(res, 200, 2, '身份验证失败，请重新登录!')
        } else {
            let COVER_UPLOAD_FOLDER = '/cover';
            //创建上传表单
            var form = new formidable.IncomingForm();
            //设置编码格式
            form.encoding = 'utf-8';
            //设置上传目录
            form.uploadDir = './public' + COVER_UPLOAD_FOLDER;
            //保留后缀
            form.keepExtensions = true;
            //文件大小
            form.maxFieldsSize = 5 * 1024 * 1024;
            form.parse(req, function (err, fields, files) {
                let filesFile = files.file
                if (err) {
                    return res.json({
                        status: 500,
                        message: "内部服务器错误",
                        result: ''
                    })
                }
                // 限制文件大小 单位默认字节 这里限制大小为2m
                if (filesFile.size > form.maxFieldsSize) {
                    fs.unlink(filesFile.path, () => {})
                    return res.json({
                        data: {
                            data: {},
                            status: 1,
                            message: "图片大小不能超过2M",
                        }
                    })
                }
                //后缀名
                var extName = '';
                switch (filesFile.type) {
                    case 'image/pjpeg':
                        extName = 'jpg';
                        break;
                    case 'image/jpeg':
                        extName = 'jpg';
                        break;
                    case 'image/png':
                        extName = 'png';
                        break;
                    case 'image/x-png':
                        extName = 'png';
                        break;
                }
                if (extName.length == 0) {
                    return res.json({
                        data: {
                            data: {},
                            status: 1,
                            message: "只支持png和jpg格式图片",
                        }
                    })
                }
                //使用第三方模块silly-datetime
                var t = sd.format(new Date(), 'YYYYMMDDHHmmss');
                //生成随机数
                var ran = parseInt(Math.random() * 8999 + 10000);
                // 生成新图片名称
                var avatarName = t + '_' + ran + '.' + extName;
                // 新图片路径
                var newPath = form.uploadDir + '/' + avatarName;
                // 更改名字和路径
                fs.rename(filesFile.path, newPath, function (err) {
                    if (err) {
                        return res.json({
                            "code": 401,
                            "message": "图片上传失败"
                        })
                    } else {
                        return res.json({
                            data: {
                                // 生产环境要修改此处
                                data: 'http://127.0.0.1:3200' + COVER_UPLOAD_FOLDER + '/' + avatarName,
                                status: 0,
                                message: "图片上传成功",
                            }
                        })
                    }
                })
            })
        }
    })
})

// 上传封面图片
router.post('/uploadEdit', (req, res) => {
    let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
    let token = tokenAndUserId.split('&&')[1];
    let userId = tokenAndUserId.split('&&')[0];

    let secretOrPrivateKey = "bgg" + userId; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) { //  时间失效的时候 || 伪造的token
            responseClient(res, 200, 2, '身份验证失败，请重新登录!')
        } else {
            let COVER_UPLOAD_FOLDER = '/editPic';
            //创建上传表单
            var form = new formidable.IncomingForm();
            //设置编码格式
            form.encoding = 'utf-8';
            //设置上传目录
            form.uploadDir = './public' + COVER_UPLOAD_FOLDER;
            //保留后缀
            form.keepExtensions = true;
            //文件大小
            form.maxFieldsSize = 5 * 1024 * 1024;
            form.parse(req, function (err, fields, files) {
                let filesFile = files.file
                if (err) {
                    return res.json({
                        status: 500,
                        message: "内部服务器错误",
                        result: ''
                    })
                }
                // 限制文件大小 单位默认字节 这里限制大小为2m
                if (filesFile.size > form.maxFieldsSize) {
                    fs.unlink(filesFile.path, () => {})
                    return res.json({
                        data: {
                            data: {},
                            status: 1,
                            message: "图片大小不能超过2M",
                        }
                    })
                }
                //后缀名
                var extName = '';
                switch (filesFile.type) {
                    case 'image/pjpeg':
                        extName = 'jpg';
                        break;
                    case 'image/jpeg':
                        extName = 'jpg';
                        break;
                    case 'image/png':
                        extName = 'png';
                        break;
                    case 'image/x-png':
                        extName = 'png';
                        break;
                }
                if (extName.length == 0) {
                    return res.json({
                        data: {
                            data: {},
                            status: 1,
                            message: "只支持png和jpg格式图片",
                        }
                    })
                }
                //使用第三方模块silly-datetime
                var t = sd.format(new Date(), 'YYYYMMDDHHmmss');
                //生成随机数
                var ran = parseInt(Math.random() * 8999 + 10000);
                // 生成新图片名称
                var avatarName = t + '_' + ran + '.' + extName;
                // 新图片路径
                var newPath = form.uploadDir + '/' + avatarName;
                // 更改名字和路径
                fs.rename(filesFile.path, newPath, function (err) {
                    if (err) {
                        return res.json({
                            "code": 401,
                            "message": "图片上传失败"
                        })
                    } else {
                        return res.json({
                            data: {
                                data: 'http://127.0.0.1:3200' + COVER_UPLOAD_FOLDER + '/' + avatarName,
                                status: 0,
                                message: "图片上传成功",
                            }
                        })
                    }
                })
            })
        }
    })
})

// 新增文章
router.post('/addArticle', (req, res) => {
    let {
        category,
        content,
        cover_image,
        desc,
        title,
        isVisable
    } = req.body;
    const now = new Date();
    var timeStr = getDateStr(now.getTime() / 1000);
    let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
    let token = tokenAndUserId.split('&&')[1];
    let userId = tokenAndUserId.split('&&')[0];

    let secretOrPrivateKey = "bgg" + userId; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) { //  时间失效的时候 || 伪造的token
            responseClient(res, 200, 2, '身份验证失败，请重新登录!')
        } else {
            let model = new articleSchema({
                userId,
                category,
                content,
                cover_image,
                desc,
                title,
                isVisable,
                createTime: timeStr,
                createTimeD: timeStr.split(' ')[0],
                updateTimeD: timeStr.split(' ')[0],
                updateTime: timeStr
            })
            model.save().then(data => {
                responseClient(res, 200, 0, '保存成功!')
            }).catch(err => {
                responseClient(err)
            })
        }
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
    let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
    let token = tokenAndUserId.split('&&')[1];
    let userId = tokenAndUserId.split('&&')[0];

    let secretOrPrivateKey = "bgg" + userId; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) { //  时间失效的时候 || 伪造的token
            responseClient(res, 200, 2, '身份验证失败，请重新登录!')
        } else {
            // 查询条件 name 不为空 
            let data = {};
            // 查询总数
            if (JSON.stringify(req.query) == '{}' || searchConditions.length == 0) {
                articleSchema.countDocuments({
                    userId
                }).then(count => {
                    data.total = count;
                    articleSchema.find({
                        userId
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
            } else {
                searchConditions.userId = userId;
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
        }
    })

})

// 删除文章
router.delete('/deleteArticle/:id', (req, res) => {
    let {
        id
    } = req.params;
    let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
    let token = tokenAndUserId.split('&&')[1];
    let userId = tokenAndUserId.split('&&')[0];

    let secretOrPrivateKey = "bgg" + userId; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) { //  时间失效的时候 || 伪造的token
            responseClient(res, 200, 2, '身份验证失败，请重新登录!')
        } else {
            articleSchema.remove({
                _id: id
            }).then(data => {
                if (data) {
                    responseClient(res, 200, 0, '删除成功!')
                }
            }).catch(err => {
                responseClient(err)
            })
        }
    })
   
   
})

// 设置文章可见与否
router.post('/setVisible', (req, res) => {
    let {
        id,
        isVisable
    } = req.body;
    let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
    let token = tokenAndUserId.split('&&')[1];
    let userId = tokenAndUserId.split('&&')[0];

    let secretOrPrivateKey = "bgg" + userId; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) { //  时间失效的时候 || 伪造的token
            responseClient(res, 200, 2, '身份验证失败，请重新登录!')
        } else {
            articleSchema.findOne({
                _id: id
            }).then(data => {
                articleSchema.update({
                    _id: id
                }, {
                    isVisable
                }).then(u => {
                    responseClient(res, 200, 0, '设置可见与否成功!')
                }).catch(err => {
                    responseClient(res)
                })
            }).catch(err => {
                responseClient(res)
            })
        }
    })
})
// 修改文章
router.post('/updateArticle', (req, res) => {
    let {
        id,
        category,
        content,
        cover_image,
        desc,
        title,
        isVisable
    } = req.body;
    const now = new Date();
    var timeStr = getDateStr(now.getTime() / 1000);
    let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
    let token = tokenAndUserId.split('&&')[1];
    let userId = tokenAndUserId.split('&&')[0];

    let secretOrPrivateKey = "bgg" + userId; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) { //  时间失效的时候 || 伪造的token
            responseClient(res, 200, 2, '身份验证失败，请重新登录!')
        } else {
            articleSchema.findOne({
                _id: id
            }).then(data => {
                articleSchema.update({
                    _id: id
                }, {
                    category,
                    content,
                    cover_image,
                    desc,
                    title,
                    isVisable,
                    updateTime: timeStr.split(' ')[0]
                }).then(u => {
                    responseClient(res, 200, 0, '更新成功!')
                }).catch(err => {
                    responseClient(res)
                })
            }).catch(err => {
                responseClient(res)
            })
        }
    })
   
})

// 获取文章详情
router.get('/getArticleInfo/:id', (req, res) => {
    let {
        id
    } = req.params;
    let tokenAndUserId = req.headers['x-auth-token']; // 从Authorization中获取token
    let token = tokenAndUserId.split('&&')[1];
    let userId = tokenAndUserId.split('&&')[0];

    let secretOrPrivateKey = "bgg" + userId; // 这是加密的key（密钥）
    jwt.verify(token, secretOrPrivateKey, (err, decode) => {
        if (err) { //  时间失效的时候 || 伪造的token
            responseClient(res, 200, 2, '身份验证失败，请重新登录!')
        } else {
            articleSchema.find({
                _id: id
            }).then(resp => {
                responseClient(res, 200, 0, '查询成功!', resp)
            }).catch(err => {
                responseClient(res)
            })
        }
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