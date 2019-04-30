'use strict'

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var mongoosePagination = require('../node_modules/mongoose-pagination')
var fs = require('fs');
var path = require('path');

function getArtist(req, res){
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artistFound) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!artistFound){
                res.status(404).send({message: 'Artista no existe'});
            }else{
                res.status(200).send({artistFound});
            }
        }
    });
}

function getArtists(req, res){
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }
    var itemsPerPage = 4;

    Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, totalItems){
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!artists){
                res.status(404).send({message: 'No existen artistas en la base de datos'});
            }else{
                return res.status(200).send({
                    totalItems: totalItems,
                    artists: artists
                });
            }
        }
    })
}

function saveArtist(req, res){
    var artist = new Artist();
    var params = req.body;

    artist.name = params.name;
    artist.description = params.description;
    artist.imagen = null;

    artist.save((err, artistStored) => {
        if(err){
            res.status(500).send({message: 'Error al guardar el artista'});
        }else{
            if(!artistStored){
                res.status(404).send({message: 'No se pudo guardar el artista'});
            }else{
                res.status(200).send({artist: artistStored});
            }
        }
    })
}

function updateArtist(req, res){
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if(err){
            res.status(500).send({message: 'Error al actualizar el artista'});
        }else{
            if(!artistUpdated){
                res.status(404).send({message: 'No se ha podido actualizar el artista'});
            }else{
                res.status(200).send({artistUpdated});
            }
        }
    })
}

function deleteArtist(req, res){
    var artistId = req.params.id;
    
    Artist.findByIdAndRemove(artistId, (err, artistRemoved) =>{
        if(err){
            res.status(500).send({message: 'Error al eliminar el artista'});
        }else{
            //Delete artist
            if(!artistRemoved){
                res.status(404).send({message: 'No se ha podido eliminar el artista'});
            }else{
                //Delete artist albums
                Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
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
                                        res.status(200).send({artistRemoved});
                                    }
                                    
                                }
                            });
                        }
                        
                    }
                });
            }
            
        }
    });
}

function uploadImage(req, res){
    var artistId = req.params.id;
    var filename = 'No subido...';

    if(req.files){
        var filepath = req.files.image.path;
        var filename = filepath.split('\\').pop().split('/').pop();

        var filenamesplit = filename.split('\.');
        var fileext = filenamesplit[1];
        
        if(fileext == 'png' || fileext == 'jpg' || fileext == 'gif'){
            Artist.findByIdAndUpdate(artistId, {image: filename}, (err, artistUpdated) => {
                if(err){
                    res.status(500).send({message: 'Error al actualizar el artista'});
                }else{
                    if(!artistUpdated){
                        res.status(500).send({message: 'No se ha podido actualizar el artista'});
                    }else{
                        res.status(200).send({artist: artistUpdated});
                    }
                }
            })
        }else{
            res.status(200).send({message: 'Extensión del archivo no válida'});
        }
    }else{
        res.status(200).send({message: 'No ha subido ninguna imagen'});
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var filePath = './uploads/artists/'+imageFile
    fs.exists(filePath, function(exists){
        if(exists){
            res.sendFile(path.resolve(filePath));
        }else{
            res.status(200).send({message: 'La imagen no existe'});
        }
    })
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}