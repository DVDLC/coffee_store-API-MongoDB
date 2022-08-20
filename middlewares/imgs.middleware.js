// Models
const { ApiError } = require("../models/ApiError");
const ProductsSchema = require("../models/Products.schema");
const UserSchema = require("../models/User.schema");
// Utils
const { catchAsync } = require("../utils/catchAsync");
const { HttpStatusCode } = require("../utils/http-statusCode");

const verifyUserOrProductExist = catchAsync( async( req, res, next ) => {
    const { collection, id } = req.params
    let model

    switch ( collection ) {
        case 'users':
            model = await UserSchema.findById( id )
            break;
        case 'products':
            model = await ProductsSchema.findById( id )
            break;
        default:
            break;
    }

    if( !model ) return next( new ApiError( 
        HttpStatusCode.BAD_REQUEST,
        `${ id } does not exist in DB`
    ))

    req.model = model
    next()
}) 

module.exports = {
    verifyUserOrProductExist
}