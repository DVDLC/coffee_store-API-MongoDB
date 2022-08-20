// Models
const { ApiError } = require("../models/ApiError")
const ProductsSchema = require("../models/Products.schema")
// Utils
const { catchAsync } = require("../utils/catchAsync")
const { HttpStatusCode } = require("../utils/http-statusCode")

const verifyProductParams = ( req, res, next ) => {

    const { name, price } = req.body

    if( req.method === 'POST' ){
        if( name.length === 0 ){
            return next( new ApiError( 
                HttpStatusCode.BAD_REQUEST,
                'name is required'
            ))
        } else if( isNaN( price ) || price <= 0 ){
            return next( new ApiError(
                HttpStatusCode.BAD_REQUEST,
                'price is required/not valid'
            ))
        }
    }else if( req.method === 'PUT' ){
        if( name ){
            if( name.length <= 1 ){
                return next( new ApiError( 
                    HttpStatusCode.BAD_REQUEST,
                    'name is required'
                ))
            }
        }if( price ){
            console.log( 'hola' )
            if( isNaN( price ) || price <= 0 ){
                return next( new ApiError(
                    HttpStatusCode.BAD_REQUEST,
                    'price is required/not valid'
                ))
            }
        }
    }

    next()
}


const verifyIfProductExits = catchAsync(async( req, res, next ) => {

    const { name } = req.body
    let productExist

    if( name ){
        productExist = await ProductsSchema.findOne({ name: name.toUpperCase() })
        if( productExist ) return next( new ApiError( 
            HttpStatusCode.BAD_REQUEST,
            `${ name } is already exist`
        ))
    }
    next()
})

module.exports = {
    verifyProductParams,
    verifyIfProductExits
}