const mysql = require('mysql2/promise')


const dbConfig = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "calendar_task"

}

const pool = mysql.createPool(dbConfig);


const testConnection = async() => {
    
    try{    

        const connection = await pool.getConnection()

        connection.release()

        console.log("Database connection successful")

    }catch(error){

        console.error("Database connection failed", error)
        process.exit(1)



    }

}


const initializeDatabase = async() => {

    /* After connection successful */

    /* Check if two tabels exist both users and task*/
    console.log("Checking and initializing database")

    try{
    
        await pool.execute(

            `CREATE TABLE IF NOT EXISTS Users(
                id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            );`

        )

        await pool.execute(

            `CREATE TABLE IF NOT EXISTS Tasks(
  
                task_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                content TEXT, 
                due_date DATE NOT NULL,
                last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES Users(id) ON DELETE CASCADE,
                INDEX idx_user_id(user_id)


            );`

        )

    




    }catch(error){


        console.log("database initialization failed", error)





    }







}


module.exports = {
    pool,
    testConnection,
    initializeDatabase

    
}
