var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var dailyFeedSchema = mongoose.Schema({
    messages:   [{type: ObjectId, ref: 'Message'}],
    created: Date
});

module.exports = mongoose.model('DailyFeed', dailyFeedSchema);