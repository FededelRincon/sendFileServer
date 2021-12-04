const { response } = require("express");
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const User = require("../models/User");


const newUser = async (req, res = response) => {

    // Mostrar mensajes de error del validator
    const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        // return res.status(400).json({
        //     errors: errors.array()
        // })
        return res.status(400).json(errors)
    }

    // revisar si el usuario ya esta registrado
    const { email, password } = req.body;

    let exists = await User.findOne({ email }); //bool

    if( exists ){
        return res.status(400).json({
            msg: 'El usuario ya esta registrado'
        })
    }

    // Crear nuevo usuario
    const user = new User(req.body);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt)


    try {
        // Guardar en DB
        await user.save();

        res.json({
            msg: 'Usuario creado correctamente',
            // user
        })

    } catch (error) {
        console.log(error)
    }
}




module.exports = {
    newUser,
}