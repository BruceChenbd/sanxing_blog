/***
 * 新建文章数据
 */

const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    userId: String,
    pictureList: Array
})