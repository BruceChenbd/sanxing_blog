/**
 * 结合
 */
const mongoose  = require('mongoose');
const videoSchema = require('../schemas/video');

module.exports = mongoose.model("videoSchema",videoSchema);