'use strict'

var mongoose = require('../node_modules/mongoose');
var schema = mongoose.Schema;

var artistSchema = schema({
    name: String,
    description: String,
    image: String
});

module.exports = mongoose.model('Artist', artistSchema);