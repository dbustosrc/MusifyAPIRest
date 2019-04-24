'use strict'

var Album = require('../models/album');
var Song = require('../models/song');

var mongoosePagination = require('../node_modules/mongoose-pagination')
var fs = require('fs');
var path = require('path');

function getAlbum(req, res){
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err, albumFound) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!albumFound){
                res.status(404).send({message: 'Álbum no existe'});
            }else{
                res.status(200).send({albumFound});
            }
        }
    });
}

function getAlbums(req, res){
    var artistId = req.params.artist;

    if(!artistId){
        // Get all albums in database
        var find = Album.find({}).sort('title');
    }else{
        // Get all artist albums in database
        var find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err, albums) =>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!albums){
                res.status(404).send({message: 'No hay álbumes'});
            }else{
                res.status(200).send({albums});
            }
        }
    })
}

function saveAlbum(req, res){
    var album = new Album();
    var params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = null;
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if(err){
            res.status(500).send({message: 'Error al guardar el álbum'});
        }else{
            if(!albumStored){
                res.status(404).send({message: 'No se pudo guardar el álbum'});
            }else{
                res.status(200).send({album: albumStored});
            }
        }
    })
}

function updateAlbum(req, res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumIdUpdated) => {
        if(err){
            res.status(500).send({message: 'Error al actualizar el álbum'});
        }else{
            if(!albumIdUpdated){
                res.status(404).send({message: 'No se ha podido actualizar el álbum'});
            }else{
                res.status(200).send({albumIdUpdated});
            }
        }
    })
}

function deleteAlbum(req, res){
    var albumId = req.params.id;
    
    Album.findByIdAndRemove(albumId, (err, albumRemoved) =>{
        if(err){
            res.status(500).send({message: 'Error al eliminar el álbum'});
        }else{
            if(!albumRemoved){
                res.status(404).send({message: 'No se ha podido eliminar el álbum'});
            }else{
                //Delete album songs
                Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                    if(err){
                        res.status(500).send({message: 'Error al eliminar la canción'});
                    }else{
                        if(!songRemoved){
                            res.status(404).send({message: 'No se ha podido eliminar la canción'});
                        }else{
                            res.status(200).send({albumRemoved});
                        }
                        
                    }
                });
            }
            
        }
    });
}

function uploadImage(req, res){
    var albumId = req.params.id;
    var filename = 'No subido...';

    if(req.files){
        var filepath = req.files.image.path;
        var filesplit = filepath.split('\\');
        
        filename = filesplit[2];

        var filenamesplit = filename.split('\.');
        var fileext = filenamesplit[1];
        
        if(fileext == 'png' || fileext == 'jpg' || fileext == 'gif'){
            Album.findByIdAndUpdate(albumId, {image: filename}, (err, albumUpdated) => {
                if(err){
                    res.status(500).send({message: 'Error al actualizar el álbum'});
                }else{
                    if(!albumUpdated){
                        res.status(500).send({message: 'No se ha podido actualizar el álbum'});
                    }else{
                        res.status(200).send({album: albumUpdated});
                    }
                }
            })
        }else{
            res.status(200).send({message: 'Extensión del archivo no válida'});
        }

        console.log(fileext);
    }else{
        req.status(200).send({message: 'No ha subido ninguna imagen'});
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var filePath = './uploads/albums/'+imageFile
    fs.exists(filePath, function(exists){
        if(exists){
            res.sendFile(path.resolve(filePath));
        }else{
            req.status(200).send({message: 'La imagen no existe'});
        }
    })
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}