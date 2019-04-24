'use strict'

var mongoose = require('./node_modules/mongoose');
var app = require('./app');
var port = process.env.port || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_angular', (err, res) => {
    if(err){
        throw err;
    }else{
        console.log("Conexión a la base de datos exitosa");

        app.listen(port, function(){
            console.log("Servidor del API.Rest de música escuchando en http://localhost:"+port);
        })
    }
});
