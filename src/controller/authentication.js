
const bcrypt = require("bcrypt");
const { pool } = require("../config/database")
const { generateToken } = require("../config/authentication")
const register = async (req,res) => {

    /* First check the request for user name and password */
    const connection = await pool.getConnection();

    try{
        const body = req.body;
        const username = body.username;
        const email = body.email;
        const password = body.password;

        if(!username || !email || !password){

            const error = {
                error:"registration error",
                message: "invalid input"

            };
            throw error;

        }
        await connection.beginTransaction()
        
        /* check user name or email exists already */
        const [users] = await connection.execute(`
            
            SELECT 1 FROM Users WHERE username = ?;

        `, [username]);


        const [emails] = await connection.execute(`
            
            SELECT 1 FROM Users WHERE email = ?;
        
        `, [email])

        if(users.length > 0 || emails.length > 0){

            const error = {
                error:"registration error",
                message: "existing username or email"

            };
            throw error;


        }


        const saltRounds = 10;
        const encryptedPassword = await bcrypt.hash(password, saltRounds)

        const [insertResult] = await connection.execute(`
            
            INSERT INTO Users (username, email, password) VALUES (?,?,?);
                
        `, [username, email, encryptedPassword])




        const user = {

            id: insertResult.insertId,
            username: username,
            email: email

        }

        const token = generateToken(user)
        await connection.commit();
        res.setHeader("Authorization",`Bearer ${token}`)
        return res.status(200).json({

            message: "success",
        


        })


        
    
   
    


    }
    catch(error){
        console.log(error)
        await connection.rollback()
        return res.status(400).json({

            error: "registration error",


        })



    }finally{
        if(connection){
            await connection.release();
        }

    }



    


}




const login = async(req, res) => {
    const connection = await pool.getConnection();

    try{
        const body = req.body;
        const username = body.username;
        const password = body.password;
        console.log(body, username, password)
        /* Obtain the user and its password */
        const [userQuery] = await connection.execute(`
            SELECT id, username, email, password FROM Users WHERE username = ?     
        `, [username]) 
        if(userQuery.length == 0){
            throw new Error("invalid login");
        }

        const matchingUser = userQuery[0]


        const passwordValidation = await bcrypt.compare(password, matchingUser.password);

        if(passwordValidation){

            const user = {

                id: matchingUser.id,
                username: matchingUser.username,
                email: matchingUser.email


            }   

            const token = generateToken(user);
            

            res.setHeader("Authorization", `Bearer ${token}`)
            return res.status(200).json({

                message: "Login successful"


            })
            



        }else{


            throw new Error("Invalid login Error")

        }








    }
    catch(error){
        console.log(error)
        return res.status(400).json({

            error: "Invalid Login"

        });


    }
    finally{
        if(connection){
            await connection.release();
        }

    }







}


const logout = (req, res) => {


    return res.status(200).json({

        message:"logout sucess"


    })




}



module.exports = {register, login, logout}
/* login

register

logout

*/