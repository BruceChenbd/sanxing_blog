/**
 * 结合
 */
const mongoose  = require('mongoose');
const picturesSchema = require('../schemas/pictures');

module.exports = mongoose.model("picturesSchema",picturesSchema);