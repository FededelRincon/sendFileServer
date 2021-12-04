const { response } = require("express");
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');


const loginUser = async ( req, res = response, next ) => {

    // Revisar si hay errores
    const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        // return res.status(400).json({
        //     errors: errors.array()
        // })
        return res.status(400).json(errors)
    }

    // Buscar usuario si esta registrado
    const { email, password } = req.body;
    const user = await User.findOne({ email })

    if( !user ){
        res.status(401).json({
            msg: 'El Usuario no existe'
        });
        return next();
    }

    // Verificar el password y autenticar usuario
    const isEqual = bcrypt.compareSync( password, user.password ); //bool
    if( isEqual ) {
        //crear JWT
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email
        }, process.env.SECRET_PASSWORD, {
            expiresIn: '8h'
        });

        return res.json({token})

    } else {
        res.status(401).json({
            msg: 'Email o Password incorrectos'
        })
        return next();        
    }
}


const userAutenticated = (req, res = response ) => {
    // console.log(req.get('Authorization'));

    // const authHeader = req.get('Authorization');

    // if( authHeader ) {
    //     // Obtener el token 
    //     const token = authHeader.split(' ')[1];

    //     //comprobar el JWT
    //     try {
    //         const  user = jwt.verify( token, process.env.SECRET_PASSWORD ); //nos da el contenido del token

    //         res.json({ user });

    //     } catch (error) {
    //         console.log(error);
    //         console.log('JWT no valido');
    //         res.json({ msg: 'Token no valido' });
    //     }
    // }
    
    // console.log(req.user)
    res.json({ user: req.user })
}



module.exports = {
    loginUser,
    userAutenticated
}