
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

//=============================
//Verificar token
//=============================
exports.verficaToken = function(req, res, next){

    var token = req.query.token;

    jwt.verify( token, SEED, (err, decoded) => {

        if (err){
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            } );
        }

        req.usuario = decoded.usuario;

         next();
    });

}

//=============================
//Verificar ADMIN
//=============================
exports.verficaADMIN_ROLE = function(req, res, next){

    var usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
        return;
    }else{

        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - No es admnistrador',
            errors: {message: 'No es administrador, no puede hacer eso'}
        } );

    }

}

//=============================
//Verificar ADMIN o Mismo Usuario
//=============================
exports.verficaADMIN_o_MismoUsuario= function(req, res, next){

    var usuario = req.usuario;
    var id = req.params.id;

    if(usuario.role === 'ADMIN_ROLE' || usuario._id === id){
        next();
        return;
    }else{

        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - No es admnistrador ni es el mismo usuario',
            errors: {message: 'No es administrador, no puede hacer eso'}
        } );

    }

}


    