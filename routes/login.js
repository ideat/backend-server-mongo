
var express = require('express');
var bcrypt = require('bcryptjs'); 
var jwt = require('jsonwebtoken');
var seed = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');
const { SEED } = require('../config/config');

app.post('/', (req, res) =>{

    var body = req.body;

    Usuario.findOne({ email: body.email}, (err, usuarioBD) =>{

        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            } );
        }

        if( !usuarioBD) {
            if (err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas - email',
                    errors: err
                } );
            }
        }

        if (!bcrypt.compareSync ( body.password, usuarioBD.password)){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            } );
        }

        //Crear un token
        usuarioBD.password = ':)';
        var token = jwt.sign({ usuario: usuarioBD}, SEED, {expiresIn: 14400}); //4 horas



        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            token: token,
            id: usuarioBD._id
        } );

    });



   
    
});







module.exports = app;