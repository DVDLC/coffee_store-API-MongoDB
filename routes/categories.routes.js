// Libraries
const { Router } = require("express");
// Controllers
const { 
    createCategory, 
    updateCategory,
    deleteCategory, 
    getAllCategories, 
    getCategoryByID 
} = require("../controllers/categorie.controller");
// Middlewares
const { validateJWT } = require("../middlewares/auth-middlewares");
const { verifyIfCategoryExist, validateCategoryID } = require("../middlewares/categorie.middlewares");
const { validateMongoID } = require("../middlewares/general.middlewares");

const routes = Router()

routes.get( '/', getAllCategories )

// Crear categoria - privado - cualquier persona con un token valido

routes.post( '/', [
    validateJWT,
    verifyIfCategoryExist
], createCategory )


routes.get( '/:id', [
    validateMongoID,
    validateCategoryID
], getCategoryByID )

// Actualizar - privado - cualquier persona con un token valido

routes.put('/:id', [
    validateJWT,
    validateMongoID,
    validateCategoryID,
    verifyIfCategoryExist
], updateCategory )

// Soft Delete - privado - solo ADMIN

routes.delete('/:id', [
    validateJWT,
    validateMongoID,
    validateCategoryID
], deleteCategory )

module.exports = routes