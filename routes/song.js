'use strict'

var express = require('../node_modules/express');
var songController = require('../controllers/song');
var md_auth = require('../middlewares/authenticated');
var multipart = require('../node_modules/connect-multiparty');
var md_updload = multipart({ uploadDir: './uploads/songs/' });
var api = express.Router();

api.get('/song/:id', md_auth.ensureAuth, songController.getSong);
api.post('/song', md_auth.ensureAuth, songController.saveSong);
api.get('/songs/:album?', md_auth.ensureAuth, songController.getSongs);
api.put('/song/:id', md_auth.ensureAuth, songController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, songController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_updload], songController.uploadFile);
api.get('/get-file-song/:songFile', md_auth.ensureAuth, songController.getFile);

module.exports = api;