/***
 * 新建文章数据
 */

const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    userId: String,
    category: String,
    content: String,
    isVisable: Boolean,
    cover_image: String,
    desc: String,
    title: String,
    createTime: String,
    createTimeD: String,
    updateTime: String,
    updateTimeD: String
})