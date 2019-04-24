'use strict'

var express = require('../node_modules/express');
var albumController = require('../controllers/album');
var md_auth = require('../middlewares/authenticated');
var multipart = require('../node_modules/connect-multiparty');
var md_updload = multipart({ uploadDir: './uploads/albums/' });
var api = express.Router();

api.get('/album/:id', md_auth.ensureAuth, albumController.getAlbum);
api.post('/album', md_auth.ensureAuth, albumController.saveAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, albumController.getAlbums);
api.put('/album/:id', md_auth.ensureAuth, albumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, albumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_updload], albumController.uploadImage);
api.get('/get-image-album/:imageFile', md_auth.ensureAuth, albumController.getImageFile);

module.exports = api;