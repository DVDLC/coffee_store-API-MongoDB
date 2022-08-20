// Libraries
const { Router } = require("express");
// Controllers
const { login, googleSignIn } = require("../controllers/auth.controllers");
// Middlewares
const { protectLogin } = require("../middlewares/auth-middlewares");


const routes = Router()

routes.post( '/login', [
    protectLogin
], login )

routes.post( '/google', 
googleSignIn )



module.exports = routes