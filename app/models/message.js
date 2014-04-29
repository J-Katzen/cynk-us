var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var messageSchema = mongoose.Schema({
    dailyFeed:   {type: ObjectId, ref: 'DailyFeed'},
    establishment: {type: ObjectId, ref: 'Establishment'},
    userpic: String,
    created: Date,
    message: String,
    hashtags: [{type: String}],
    username: String,
    userInstaId: String,
    type: String,
    link: String,
    thumb: String,
    standard: String,
    instagramId: {type: String, unique: true},
    geoloc: {
        longitude: {type: Number},
        latitude: {type: Number}
    }
});

module.exports = mongoose.model('Message', messageSchema);