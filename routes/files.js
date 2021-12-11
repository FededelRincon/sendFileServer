const express = require('express');
const router = express.Router();

const { uploadFile, download, deleteFile } = require('../controllers/filesController')
const { isLogin } = require('../middleware/auth');


router.post('/', [
    isLogin,
    // check('email', 'El Email no es válido').isEmail(),
    // check('password', 'El Password no puede ser vacio').not().isEmpty()
], uploadFile);

router.get('/:file',[
    download
], deleteFile);


// router.delete('/:id', [
//     // isLogin,
// ], deleteFile);


module.exports = router;