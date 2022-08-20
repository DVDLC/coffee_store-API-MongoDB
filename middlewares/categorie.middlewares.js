
// Models
const { ApiError } = require("../models/ApiError");
const CategorySchema = require("../models/Category.schema");
// Utils
const { catchAsync } = require("../utils/catchAsync");
const { HttpStatusCode } = require("../utils/http-statusCode");

const verifyIfCategoryExist = catchAsync( async( req, res, next ) => {
    let { name } = req.body 

    if( !name || name.length === 0 ){
        return next( new ApiError( 
            HttpStatusCode.BAD_REQUEST,
            'category name is required'
        ))
    }

    name = name.toUpperCase() 
    const categoryExist = await CategorySchema.findOne({ name })
    if( categoryExist ) return next( new ApiError( 
        HttpStatusCode.BAD_REQUEST,
        `${name.toLowerCase()} is already exist`
    ))

    next()
})


const validateCategoryID = catchAsync( async( req, res, next ) => {

    const { id } = req.params 

    const idExistInDB = await CategorySchema.findById( id )
    if( !idExistInDB ) return next( new ApiError(
        HttpStatusCode.BAD_REQUEST,
        'Category not found'
    ))
    
    next()
})


module.exports = {
    verifyIfCategoryExist,
    validateCategoryID
}