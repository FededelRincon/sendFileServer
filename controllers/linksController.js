const Link = require('../models/Link');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');



const newLink = async ( req, res, next ) => {

    // Revisar si hay errores
    const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        return res.status(400).json(errors)
    }

    // Almacenar un onjeto Enlace
    const { original_name } = req.body;

    const link = new Link();
    link.url = shortid.generate();
    link.name = shortid.generate();
    link.original_name = original_name;


    // Si el usuario esta autenticado
    if ( req.user ) {
        const { passwordFile, downloads } = req.body

        //Asignar numero de descargas
        if ( downloads ) {
            link.downloads = downloads;
        }
        
        //Asignar un password
        if ( passwordFile ) {
            const salt = await bcrypt.genSalt(10);
            link.passwordFile = await bcrypt.hash( passwordFile, salt );
        }

        // Asignar el autor
        link.author = req.user.id;
    }

    // guardar en DB
    try {
        await  link.save();
        res.json({
            msg: `${ link.url }`
        })

        return next();

    } catch (error) {
        console.log(error)
    }
}


// Obtener el enlace
const getLink = async (req, res, next) => {

    const { url } = req.params;

    //Verificar si existe el enlace
    const exist = await Link.findOne({ url });   //null o object
    
    if( !exist ){
        res.status(404).json({
            msg: 'Ese enlace no existe'
        });
        return next();
    }

    // Si exist file en DB
    res.json({file: exist.name });


    // Si las descargas son iguales a 1
    const { downloads, name } = exist;
    // console.log('linksController-82', exist);

    if( downloads === 1 ){
        
        req.file = name;


        // Eliminar la entrada en la DB
        await Link.findOneAndRemove( req.params.url );

        next();
        

    } else {
        // Si las descargas son mayores a 1
        exist.downloads--;  //resto una descarga
        await exist.save();

        // console.log('quedan descargas por hacer')
        
    }





}



module.exports = {
    newLink,
    getLink,
}