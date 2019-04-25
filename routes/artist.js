'use strict'

var express = require('../node_modules/express');
var artistController = require('../controllers/artists');
var md_auth = require('../middlewares/authenticated');
var multipart = require('../node_modules/connect-multiparty');
var md_updload = multipart({ uploadDir: './uploads/artists/' });
var api = express.Router();

api.get('/artist/:id', md_auth.ensureAuth, artistController.getArtist);
api.post('/artist', md_auth.ensureAuth, artistController.saveArtist);
api.get('/artists/:page?', md_auth.ensureAuth, artistController.getArtists);
api.put('/artist/:id', md_auth.ensureAuth, artistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, artistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_updload], artistController.uploadImage);
api.get('/get-image-artist/:imageFile', artistController.getImageFile);

module.exports = api;