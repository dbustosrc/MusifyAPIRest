'user strict'

var jwt = require('../node_modules/jwt-simple');
var moment = require('../node_modules/moment');
var secret = 'clave_secreta_curso';

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La petición no tiene la cabecera de autenticación'});
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');
    
    try {
        var payload = jwt.decode(token, secret);

        if(payload.exp <= moment.unix()){
            return res.status(401).send({message: 'Token expirado'});
        }
    } catch (error) {
        console.log(error);
        return res.status(404).send({message: 'Token no válido'});
    }

    req.user = payload;

    next();
}