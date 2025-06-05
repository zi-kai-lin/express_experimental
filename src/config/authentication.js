const jwt = require('jsonwebtoken')

/* Get secret key and expiration */

const secretKey = process.env.SECRET_KEY;
const expiration = process.env.SECRET_EXPIRATION;


const generateToken = (user) => {

    return jwt.sign({id :user.id, name: user.username, email: user.email}, secretKey, {expiresIn: expiration})


}

const validateToken = (token) => {


    return jwt.verify(token, secretKey)


}


module.exports = {

    generateToken, 
    validateToken,

}