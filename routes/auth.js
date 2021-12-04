const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { loginUser, userAutenticated } = require('../controllers/authController')
const { isLogin } = require('../middleware/auth');


router.post('/', [
    check('email', 'El Email no es válido').isEmail(),
    check('password', 'El Password no puede ser vacio').not().isEmpty()
], loginUser);


router.get('/', [
    isLogin,
], userAutenticated);


module.exports = router;