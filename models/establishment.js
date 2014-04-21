var mongoose = require('mongoose');

var establishmentSchema = mongoose.Schema({
    name:   String,
    instagramId: {type: String, unique: true},
    latitude: Number,
    longitude: Number
});

module.exports = mongoose.model('Establishment', establishmentSchema);