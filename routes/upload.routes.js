// Libraries
const { Router } = require("express");
// Controllers
const { 
    updateProductFileCloudinary, 
    updateUserFileCloudinary
} = require("../controllers/upload.controllers");
// Middlewares
const { validateJWT, protectSession, haveRole } = require("../middlewares/auth-middlewares");
const { validateMongoID } = require("../middlewares/general.middlewares");
const { verifyIfProductExits } = require("../middlewares/product.middlewares");
const { validateExtAndFiles } = require("../middlewares/upload.middlewares");
const { validateUserID } = require("../middlewares/user-middlewares");

const routes = Router()

routes.put( '/user/:id', [
    validateJWT,
    validateMongoID,
    validateUserID,
    protectSession,
    validateExtAndFiles
], updateUserFileCloudinary )

routes.put( '/product/:id', [
    validateJWT,
    haveRole( 'SELLS_ROLE', 'ADMIN_ROLE' ),
    validateMongoID,
    verifyIfProductExits,
    validateExtAndFiles
], updateProductFileCloudinary )

module.exports = routes