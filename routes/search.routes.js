const { Router } = require("express");
const { search, adminSearch } = require("../controllers/search.controllers");
const { validateJWT, haveRole } = require("../middlewares/auth-middlewares");
const { validCollection } = require("../middlewares/search.middlewares");


const routes = Router()

routes.get( '/:collection/:term', [
    validCollection( [ 'product', 'category' ] )
], search )

routes.get( '/admin/users/:term', [
    validateJWT,
    haveRole( 'ADMIN_ROLE' )
], adminSearch )


module.exports = routes