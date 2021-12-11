const jwt = require('jsonwebtoken');


const isLogin = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if( authHeader ) {
        // Obtener el token 
        const token = authHeader.split(' ')[1];

        //comprobar el JWT
        try {
            const  user = jwt.verify( token, process.env.SECRET_PASSWORD ); //nos da el contenido del token
            req.user = user

        } catch (error) {
            console.log(error);
            console.log('JWT no valido');
            return res.json({ msg: 'Token no valido' });    
            //chequear que pasa cuando expira el token, ya fallo y creo q el return lo arregla
        }
    }
    return next();
}


module.exports = {
    isLogin,
}




// module.exports = (req, res, next) => {
//     console.log('Yo soy un middleware');
//     return (next)
// }

// const algo = (req, res, next) => {
//     console.log('Yo soy un middleware');
//     return (next)
// }
// module.exports = {
//     algo
// }