const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { newUser } = require('../controllers/usersController');

router.post('/', [
    check('name', 'El Nombre es obligatorio').not().isEmpty(),
    check('email', 'El Email no es válido').isEmail(),
    check('password', 'El Password debe ser de al menos de 6 caracteres').isLength({ min: 6 }),
], newUser);



module.exports = router;