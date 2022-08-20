// Libraries
const { default: mongoose } = require("mongoose");
// Models
const { ApiError } = require("../models/ApiError");
const RolesSchema = require("../models/Roles.schema");
const UserSchema = require("../models/User.schema");
// Utils
const { catchAsync } = require("../utils/catchAsync");
const { HttpStatusCode } = require("../utils/http-statusCode");

const verifyEmailExist = catchAsync( async( req, res, next) => {
    const { email } = req.body
    const emailExist = await UserSchema.findOne({ email })

    if( emailExist ) return next( new ApiError(  
        HttpStatusCode.NOT_FOUND,
        'email is already exist'
    ))

    next()
})

const validateSignUpParams = ( req, res, next ) => {
    const { name, email, password, role } = req.body

    if( name.length === 0 ){
       return next( new ApiError( HttpStatusCode.BAD_REQUEST, 'name is required' ) )
    }if( email.length <= 0 ){
        return next( new ApiError( HttpStatusCode.BAD_REQUEST, 'email is required' ) )
    }if( password.length === 0 ){
        return next( new ApiError( HttpStatusCode.BAD_REQUEST, 'password is required' ) )
    }if( role.length === 0 ){
        return next( new ApiError( HttpStatusCode.BAD_REQUEST, 'role is required' ) )
    }

    next()
}

const validateIsEmail = ( req, res, next ) => {
    const regex = /\S+@\S+\.\S+/
    const { email } = req.body

    const isValidEmail = regex.test( email )

    if( !isValidEmail ) return next( new ApiError( HttpStatusCode.BAD_REQUEST, 'Email is invalid' ) )

    next()
}

const validateRole = catchAsync( async( req, res, next ) => {
    const { role } = req.body

    if( role ){
        const roleExist = await RolesSchema.findOne({ role })
        if( !roleExist ) return next( new ApiError(  
            HttpStatusCode.BAD_REQUEST,
            'That role is does not exist'
        ))
    }
    next()
})

const validateUserID = catchAsync( async( req, res, next ) => {

    const { id } = req.params 

    const idExistInDB = await UserSchema.findById( id )
    console.log( id )
    if( !idExistInDB ) return next( new ApiError(
        HttpStatusCode.BAD_REQUEST,
        'User not found'
    ))
    
    next()
})

module.exports = {
    verifyEmailExist,
    validateIsEmail,
    validateRole,
    validateSignUpParams,
    validateUserID
}