/***
 * 我的剪辑数据结构
 */

const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    userId: String,
    title: String,
    url: String,   
})