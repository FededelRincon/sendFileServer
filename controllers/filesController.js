const { response } = require("express");
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');


const uploadFile = async ( req, res = response, next ) => {

    const configMulter = {
        limits : { fileSize : req.user ? (1024*1024*10) : (1024*1024) }, // 10mb o 1mb 
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb( null, __dirname+'/../uploads' )
            },
            filename: (req, file, cb) => {
                // const extension = file.mimetype.split('/')[1];
                // const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)[1];
                const extensionArray = file.originalname.split('.');
                const extensionName = extensionArray[ extensionArray.length -1 ];
                cb( null, `${shortid.generate()}.${extensionName}`);
            },
                //si quisiera restringuir algun tipo de archivo
            // fileFilter: (req, file, cb) => {
            //     if(file.mimetype === "application/pdf") {
            //         return cb(null, true);
            //     }
            // }
        })
    }
    
    const upload = multer(configMulter).single('file');


    upload(req, res, async (error) => {
        console.log(req.file)

        if( !error ) {
            res.json({
                file: req.file.filename
            });
        } else {
            console.log(error);
            return next();
        }
    })


}

const deleteFile = async ( req, res = response) => {

    console.log(req.file)

    try {
        fs.unlinkSync(__dirname + `/../uploads/${ req.file }`)
        console.log('archivo eliminado');
    } catch (error) {
        console.log(error);
    }



}

module.exports = {
    uploadFile,
    deleteFile,
}