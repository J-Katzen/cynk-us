var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var messageSchema = mongoose.Schema({
    dailyFeed:   [{type: ObjectId, ref: 'DailyFeed'}],
    establishment: {type: ObjectId, ref: 'Establishment'},
    created: Date,
    message: String,
    hashtags: [{type: String}],
    username: String,
    type: String,
    link: String,
    instagramId: String,
    geoloc: {
        longitude: {type: Number},
        latitude: {type: Number}
    }
});

module.exports = mongoose.model('Message', messageSchema);