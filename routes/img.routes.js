const { Router } = require("express");
const { showImgs } = require("../controllers/img.controllers");
const { validateMongoID } = require("../middlewares/general.middlewares");
const { verifyUserOrProductExist } = require("../middlewares/imgs.middleware");
const { validCollection } = require("../middlewares/search.middlewares");


const routes = Router()

routes.get( '/:collection/:id', [
    validCollection([ 'users', 'products' ]),
    validateMongoID,
    verifyUserOrProductExist
], showImgs )

module.exports = routes