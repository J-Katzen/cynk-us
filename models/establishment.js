var mongoose = require('mongoose');

var establishmentSchema = mongoose.Schema({
    name:   String,
    instagramId: String,
    latitude: Number ,
    longitude: Number
});

module.exports = mongoose.model('Establishment', establishmentSchema);