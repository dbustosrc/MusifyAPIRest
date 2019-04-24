'user strict'

var jwt = require('../node_modules/jwt-simple');
var moment = require('../node_modules/moment');
var secret = 'clave_secreta_curso';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }

    return jwt.encode(payload, secret);
}