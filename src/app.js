require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const helmet = require('helmet');
const morgan = require("morgan");
const { testConnection, initializeDatabase } = require("./config/database.js");
const { authRouter } = require("./router/authentication")
const { taskRouter } = require("./router/tasks")
/* Define global middlewares */
const corsSetting = {

    origin: [

        "http://localhost:3000"
        

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
})();


/* Test database conneciton first */

app.use(cors(corsSetting));
app.use(helmet());
app.use(morgan("tiny"));
app.use(bodyParser.json());

app.get("/", (req, res) => {

    res.status(200).json({message:"hello"});

});


app.use("/api/auth", authRouter);


app.use("/api/task", taskRouter);




module.exports = app;



/* const PORT = process.env.PORT;
app.listen(PORT, () => {

    console.log("backend server listening on port", PORT)

});
 */



