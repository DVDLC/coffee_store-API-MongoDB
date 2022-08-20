// Libraries
const { Router } = require("express");
// Controller
const { 
    getAllProducts, 
    createProduct, 
    getProductByID, 
    updateProduct, 
    deleteProduct 
} = require("../controllers/product.controller");
// Middlewares
const { 
    validateJWT, 
    haveRole 
} = require("../middlewares/auth-middlewares");
const { 
    validateCategoryID 
} = require("../middlewares/categorie.middlewares");
const { validateMongoID } = require("../middlewares/general.middlewares");
const { 
    verifyProductParams, 
    verifyIfProductExits 
} = require("../middlewares/product.middlewares");



const routes = Router()

routes.get( '/', getAllProducts )

routes.post( '/:id', [
    validateJWT,
    haveRole( 'SELLS_ROLE', 'ADMIN_ROLE' ),
    validateMongoID,
    validateCategoryID,
    verifyProductParams,
    verifyIfProductExits
], createProduct )

routes.get( '/:id', [
    verifyIfProductExits
], getProductByID )

routes.put( '/:id', [
    validateJWT,
    haveRole( 'SELLS_ROLE', 'ADMIN_ROLE' ),
    validateMongoID,
    verifyProductParams,
    verifyIfProductExits
], updateProduct )

routes.delete( '/:id', [
        validateJWT,
        haveRole('ADMIN_ROLE' ),
        validateMongoID,
        verifyIfProductExits
], deleteProduct )


module.exports = routes