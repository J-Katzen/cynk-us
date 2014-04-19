var mongoose = require('mongoose');

var establishmentSchema = mongoose.Schema({
    name:   String
});

module.exports = mongoose.model('Establishment', establishmentSchema);