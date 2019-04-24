'use strict'

var Album = require('../models/album');
var Song = require('../models/song');

var mongoosePagination = require('../node_modules/mongoose-pagination')
var fs = require('fs');
var path = require('path');

function getSong(req, res){
    var songId = req.params.id;

    Song.findById(songId).populate({path: 'album', populate: {path: 'artist', model: 'Artist'}}).exec((err, songFound) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!songFound){
                res.status(404).send({message: 'Canción no existe'});
            }else{
                res.status(200).send({songFound});
            }
        }
    });
}

function getSongs(req, res){
    var albumId = req.params.album;

    if(!albumId){
        // Get all songs in database
        var find = Song.find({}).sort('name');
    }else{
        // Get all album songs in database
        var find = Song.find({album: albumId}).sort('number');
    }

    find.populate({path: 'album', populate: {path: 'artist', model: 'Artist'}}).exec((err, songs) =>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!songs){
                res.status(404).send({message: 'No hay canciones'});
            }else{
                res.status(200).send({songs});
            }
        }
    })
}

function saveSong(req, res){
    var song = new Song();
    var params = req.body;

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStored) => {
        if(err){
            res.status(500).send({message: 'Error al guardar el canción'});
        }else{
            if(!songStored){
                res.status(404).send({message: 'No se pudo guardar la canción'});
            }else{
                res.status(200).send({song: songStored});
            }
        }
    })
}

function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songIdUpdated) => {
        if(err){
            res.status(500).send({message: 'Error al actualizar la canción'});
        }else{
            if(!songIdUpdated){
                res.status(404).send({message: 'No se ha podido actualizar la canción'});
            }else{
                res.status(200).send({songIdUpdated});
            }
        }
    })
}

function deleteSong(req, res){
    var songId = req.params.id;
    
    Song.findByIdAndRemove(songId, (err, songRemoved) =>{
        if(err){
            res.status(500).send({message: 'Error al eliminar la canción'});
        }else{
            if(!songRemoved){
                res.status(404).send({message: 'No se ha podido eliminar la canción'});
            }else{
                res.status(200).send({songRemoved});
            }
        }
    });
}

function uploadFile(req, res){
    var songId = req.params.id;
    var filename = 'No subido...';

    if(req.files){
        var filepath = req.files.file.path;
        var filesplit = filepath.split('\\');
        
        filename = filesplit[2];

        var filenamesplit = filename.split('\.');
        var fileext = filenamesplit[1];
        
        if(fileext == 'mp3' || fileext == 'ogg'){
            Song.findByIdAndUpdate(songId, {file: filename}, (err, songUpdated) => {
                if(err){
                    res.status(500).send({message: 'Error al actualizar la canción'});
                }else{
                    if(!songUpdated){
                        res.status(500).send({message: 'No se ha podido actualizar la canción'});
                    }else{
                        res.status(200).send({song: songUpdated});
                    }
                }
            })
        }else{
            res.status(200).send({message: 'Extensión del archivo no válida'});
        }

        console.log(fileext);
    }else{
        req.status(200).send({message: 'No ha subido ninguna archivo'});
    }
}

function getFile(req, res){
    var songFile = req.params.songFile;
    var filePath = './uploads/songs/'+songFile
    fs.exists(filePath, function(exists){
        if(exists){
            res.sendFile(path.resolve(filePath));
        }else{
            req.status(200).send({message: 'El archivo no existe'});
        }
    })
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getFile
}