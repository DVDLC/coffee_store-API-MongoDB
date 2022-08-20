// Libraries
const { Router } = require("express");
// Controllers
const { 
    postUser, 
    updateUser,
    getUsers,
    deleteUser
} = require("../controllers/user.controllers");
// Middlewares
const { 
    verifyEmailExist, 
    validateUserID, 
    validateSignUpParams, 
    validateIsEmail,
    validateRole
} = require("../middlewares/user-middlewares");
const { validateJWT, protectSession, haveRole } = require("../middlewares/auth-middlewares");
const { validateMongoID } = require("../middlewares/general.middlewares");
const { validateExtAndFiles } = require("../middlewares/upload.middlewares");


const routes = Router()

// TODO: proteger endpoint admin role
routes.get( '/', getUsers )

routes.post( '/', [
    validateSignUpParams,
    validateIsEmail,
    verifyEmailExist,
    validateRole,
    validateExtAndFiles
], postUser )



routes.patch( '/:id', [
    validateMongoID,
    validateUserID,
    validateJWT,
    protectSession,
    haveRole( 'ADMIN_ROLE', 'USER_ROLE' ),
    verifyEmailExist,
    validateRole,
], updateUser )

routes.delete( '/:id', [
    validateMongoID,
    validateUserID,
    validateJWT, 
    protectSession
], deleteUser )


module.exports = routes