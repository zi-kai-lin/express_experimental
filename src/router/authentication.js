const express = require("express")
const { register, login, logout } = require('../controller/authentication')

const authRouter = express.Router();


authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/test", (req, res) => {

    return res.status(200).json({message:" aye"})

})

module.exports = {authRouter};


