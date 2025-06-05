require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const helmet = require('helmet');
const morgan = require("morgan");
const { testConnection, initializeDatabase, pool } = require("./config/database");
const { connectRedis, client } = require("./config/redis")
const { authRouter } = require("./router/authentication")
const { taskRouter } = require("./router/tasks")

/* Define global middlewares */
const corsSetting = {

    origin: [

        "http://localhost:3000",
        "http://localhost:3005"
        

    ],

    credentials: true,

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],

    maxAge: 86400 

};
/* compiler adds semicoon itself, and iife runs between the defintiion and the function */
/* Okay, need semicolon, else immediately invoked function will run all previous */


const app = express();

(async () => {
    await testConnection();
    await initializeDatabase();
    await connectRedis();
})();


/* Test database conneciton first */

app.use(cors(corsSetting));
app.use(helmet());
app.use(morgan("tiny"));
app.use(bodyParser.json());

app.get("/", (req, res) => {

    res.status(200).json({message:"hello2"});

});


app.use("/api/auth", authRouter);


app.use("/api/task", taskRouter);






/* const PORT = process.env.PORT;
app.listen(PORT, () => {

    console.log("backend server listening on port", PORT)

});
 */


const shutdown = async (signal) => {
    console.log(`Received ${signal}, shutting down gracefully...`);
    
    try {
        // Close Redis connection
        if (client.isOpen) {
            await client.quit();
            console.log('Redis connection closed');
        }

        if (pool){
            await pool.end();
            console.log("sql pool closed")

        }
        
        // Close MySQL pool (if you have pool.end())
        // await pool.end();
        
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
};

// Listen for shutdown signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));   // Ctrl+C

module.exports = app;
