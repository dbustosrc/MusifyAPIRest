'use strict'

var mongoose = require('../node_modules/mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String
});

module.exports = mongoose.model('User', userSchema);