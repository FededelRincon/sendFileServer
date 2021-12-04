const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { newLink, getLink } = require('../controllers/linksController')
const { deleteFile } = require('../controllers/filesController');

const { isLogin } = require('../middleware/auth');


router.post('/', [
    check('name', 'Sube un archivo').not().isEmpty(),
    check('original_name', 'Sube un archivo').not().isEmpty(),
    isLogin,
], newLink);


router.get('/:url', [
    getLink,
], deleteFile);


module.exports = router;