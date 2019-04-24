'use strict'

var express = require('../node_modules/express');
var userController = require('../controllers/user');
var md_auth = require('../middlewares/authenticated');
var multipart = require('../node_modules/connect-multiparty');
var md_updload = multipart({ uploadDir: './uploads/users/' });
var api = express.Router();

api.get('/probando-Controlador', md_auth.ensureAuth, userController.pruebas);
api.post('/registerUser', userController.saveUser);
api.post('/loginUser', userController.loginUser);
api.put('/updateUser/:id', md_auth.ensureAuth, userController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_updload], userController.uploadImage);
api.get('/get-image-user/:imageFile', userController.getImageFile);

module.exports = api;