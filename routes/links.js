const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { newLink, getLink, allLinks, hasPassword, verifyPassword } = require('../controllers/linksController')

const { isLogin } = require('../middleware/auth');


router.post('/', [
    check('name', 'Sube un archivo').not().isEmpty(),
    check('original_name', 'Sube un archivo').not().isEmpty(),
    isLogin,
], newLink);


router.get('/', [

], allLinks)


router.get('/:url', [
    hasPassword
], getLink);

router.post('/:url', [
    verifyPassword
], getLink
)


module.exports = router;