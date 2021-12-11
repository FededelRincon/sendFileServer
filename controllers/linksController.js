const Link = require('../models/Link');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { response } = require('express');



const newLink = async ( req, res, next ) => {
    // console.log(req.body)

    // Revisar si hay errores
    const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        return res.status(400).json(errors)
    }

    // Almacenar un objeto de Enlace
    const { original_name, name } = req.body;

    const link = new Link();
    link.url = shortid.generate();
    // link.name = shortid.generate();
    link.name = name;
    link.original_name = original_name;


    // Si el usuario esta autenticado
    if ( req.user ) {
        const { password, downloads } = req.body
        passwordFile = password;    //en front le puse password, y en modelo puse passwordFile.... :facepalm:

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


// Obtiene un listado de todos los enlaces
const allLinks = async (req, res = response) => {

    try {
        const links = await Link.find({}).select('url -_id');  //trae todo, pero mostrame solo la url
        res.json({links});

    } catch (error) {
        console.log(error)
    }

}

// Tiene password o no
const hasPassword = async (req, res, next) => {

    const { url } = req.params;
    // console.log(url)

    //Verificar si existe el enlace
    const link = await Link.findOne({ url });   //null o object
    
    if( !link ){
        res.status(404).json({
            msg: 'Ese enlace no existe'
        });
        return next();
    }

    if(link.passwordFile) {
        return res.json({
            passwordFile: true,
            link: link.url
        })
    }

    next();
}


//Verifica si el password es correcto
const verifyPassword = async ( req, res, next ) => {
    const { url } = req.params;
    const { password } = req.body;

    //consultar enlace en DB
    const link = await Link.findOne({ url });

    // verificar el password
    const search = bcrypt.compareSync( password, link.passwordFile);
    if( search ) {
        // permitir descargar archivo
        next();

    } else {
        //contraseña incorrecta
        return res.status(401).json({
            msg: 'Password Incorrecto'
        })
    }


}




// Obtener el enlace
const getLink = async (req, res, next) => {

    const { url } = req.params;
    // console.log(url)

    //Verificar si existe el enlace
    const exist = await Link.findOne({ url });   //null o object
    
    if( !exist ){
        res.status(404).json({
            msg: 'Ese enlace no existe'
        });
        return next();
    }

    // Si exist file en DB
    res.json({
        file: exist.name,
        password: false
    });

    next();

}



module.exports = {
    newLink,
    getLink,
    allLinks,
    hasPassword,
    verifyPassword,
}