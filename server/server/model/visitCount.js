/**
 * 结合
 */
const mongoose  = require('mongoose');
const visitCountSchema = require('../schemas/visitCount');

module.exports = mongoose.model("visitCountSchema",visitCountSchema);