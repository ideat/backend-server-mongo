
var express = require('express');

const fileUpload = require('express-fileupload');
const fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');
// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de coleccion
    var tiposValidos = ['hospitales','medicos','usuarios'];
    if( tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok:false,
            mensaje: 'Tipo de coleccion no es valida',
            errors: { message: 'Tipo de coleccion no es valida'}
        });
    }


    if( !req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen'}
        });
    }

    //Obtener nombre del archivo
    var archivo = req.files.imagen;

    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length-1];

    //Solo estas extensiones aceptamos
    var extensionesValidas = ['png','jpg','gif','jpeg'];

    if(extensionesValidas.indexOf( extensionArchivo )<0){  //no encontro una extension valida
        res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son ' + extensionesValidas.join(', ')}
        } );
    }

    //Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${extensionArchivo}`;


    //Mover el archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv( path, err =>{

        if( err ){
            res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            } );
        }

        subirPorTipo( tipo, id, nombreArchivo, res)
       
    });

});

function subirPorTipo( tipo, id, nombreArchivo, res){

    if( tipo === 'usuarios'){

        Usuario.findById(id, (err, usuario) =>{

            var pathViejo = './uploads/usuarios/'+usuario.img;
            
            if(!usuario){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario con id ' + id + 'no existe',
                    errors: { message: 'Usuario no existe'}
                   
                } );
            }

            //Si existe elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                console.log('Path viejo2:', pathViejo)
               
                fs.unlink(pathViejo, (err) => {
                    if (err) throw err;
                    console.log(pathViejo +' eliminado');
                  });
             
            }

            usuario.img = nombreArchivo;

            usuario.save(( err, usuarioActualizado) =>{

                usuarioActualizado.password = ':)';

               return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                } );

            });

        });
        
    }

    if( tipo === 'medicos'){

        Medico.findById(id, (err, medico) =>{

            var pathViejo = './uploads/medicos/'+medico.img;
          
            if(!medico){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Medico con id ' + id + 'no existe',
                    errors: { message: 'Medic no existe'}
                   
                } );
            }

            //Si existe elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                           
                fs.unlink(pathViejo, (err) => {
                    if (err) throw err;
                    console.log(pathViejo +' eliminado');
                  });
            }

            medico.img = nombreArchivo;

            medico.save(( err, medicoActualizado) =>{

               return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    medico: medicoActualizado
                } );

            });

        });
    }

    if( tipo === 'hospitales'){

        Hospital.findById(id, (err, hospital) =>{

            var pathViejo = './uploads/hospitales/'+hospital.img;
            
            if(!hospital){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Hospital con id ' + id + 'no existe',
                    errors: { message: 'Hospital no existe'}
                   
                } );
            }

            //Si existe elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                           
                fs.unlink(pathViejo, (err) => {
                    if (err) throw err;
                    console.log(pathViejo +' eliminado');
                  });
            }

            hospital.img = nombreArchivo;

            hospital.save(( err, hospitalActualizado) =>{

               return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    hospital: hospitalActualizado
                } );

            });

        });

    }

}

module.exports= app;