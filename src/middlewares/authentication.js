const { validateToken } = require('../config/authentication')


const authenticate = (req, res, next) => {

    /* Check for headers for authentication token */
    try{
        /* use request.header for authorization */
        const authHeader = req.headers.authorization;

        console.log("authHeader is", authHeader);
        if(!authHeader){

            throw new Error("Invalid token");

        }
        const parts = authHeader.split(" ");
        if (!(parts.length == 2 && parts[0] == "Bearer")){
            throw new Error("Invalid token");
        }

        const token = parts[1];

        req.user = validateToken(token);

        next();

        


    }catch (error){
        return res.status(403).json(

            {
                error: "Invalid Authorization",
                message: "Token Authorization failed"
            }


        )


    }


    /* If not exist then respond with error */



    /* Then validate token */



    /* If validated, set the body for the user and next */



    /* Catch any error with invalid token */

}

module.exports = {authenticate}