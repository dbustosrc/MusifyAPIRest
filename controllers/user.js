'use strict'

var User = require('../models/user');
var bcrypt = require('../node_modules/bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

function pruebas(req, res){
    res.status(200).send({
        message: 'Probando una acción el controlador de usuarios del API.Rest con Node.js y MongoDB'
    })
}

function saveUser(req, res){
    var user = new User();
    var params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if(params.password){
        //Crypt password and save data
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;

            if(user.name != null && user.surname != null && user.email != null){
                //Save user
                user.save((err, userStored) => {
                    if(err){
                        res.status(500).send({message: 'Error al guardar el usuario'});
                    }else{
                        if(!userStored){
                            res.status(404).send({message: 'No se ha registrado el usuario'});
                        }else{
                            res.status(200).send({user: userStored});
                        }
                    }
                });
            }else{
                //Fill all fields
                res.status(200).send({message: 'Ingrese todos los campos'});
            }
        });
    }else{
        res.status(200).send({message: 'Ingrese una contraseña'});
    }
}

function loginUser(req, res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }
        else{
            if(!user){
                res.status(404).send({message: 'El usuario no existe'});
            }else{
                //Check password
                bcrypt.compare(password, user.password, (err, check) => {
                    if(check){
                        //Return logged user
                        if(params.gethash){
                            //Return jwt token
                            res.status(200).send({token: jwt.createToken(user)})
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        //User can't login
                        res.status(404).send({message: 'El usuario no ha podido loguearse'});
                    }
                });
            }
        }
    })
}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    if(userId != req.user.sub){
        res.status(500).send({message: 'No se puede actualizar un usuario diferente al actual'});
    }else{
        User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
            if(err){
                res.status(500).send({message: 'Error al actualizar el usuario'});
            }else{
                if(!userUpdated){
                    res.status(500).send({message: 'No se ha podido actualizar el usuario'});
                }else{
                    res.status(200).send({user: userUpdated});
                }
            }
        })
    }
}

function uploadImage(req, res){
    var userId = req.params.id;
    var filename = 'No subido...';

    if(req.files){
        var filepath = req.files.image.path;
        var filename = filepath.split('\\').pop().split('/').pop();

        var filenamesplit = filename.split('\.');
        var fileext = filenamesplit[1];
        
        if(fileext == 'png' || fileext == 'jpg' || fileext == 'gif'){
            User.findByIdAndUpdate(userId, {image: filename}, (err, userUpdated) => {
                if(err){
                    res.status(500).send({message: 'Error al actualizar el usuario'});
                }else{
                    if(!userUpdated){
                        res.status(500).send({message: 'No se ha podido actualizar el usuario'});
                    }else{
                        res.status(200).send({image: filename, user: userUpdated});
                    }
                }
            })
        }else{
            res.status(200).send({message: 'Extensión del archivo no válida'});
        }

        console.log(fileext);
    }else{
        res.status(200).send({message: 'No ha subido ninguna imagen'});
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var filePath = './uploads/users/'+imageFile
    fs.exists(filePath, function(exists){
        if(exists){
            res.sendFile(path.resolve(filePath));
        }else{
            res.status(200).send({message: 'La imagen no existe'});
        }
    })
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};