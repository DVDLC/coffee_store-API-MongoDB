// Libraries
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// Models
const { ApiError } = require("../models/ApiError");
const UserSchema = require("../models/User.schema");
// Utils
const { catchAsync } = require("../utils/catchAsync");
const { HttpStatusCode } = require("../utils/http-statusCode");

const protectLogin = catchAsync( async( req, res, next ) => {
    const { email, password } =  req.body
    const query = { email, status: true }

    const userExist = await UserSchema.findOne( query )
    if( !userExist ) return next( new ApiError( 
        HttpStatusCode.BAD_REQUEST,
        'User not found' 
    ))

    const isPasswordCorrect = bcrypt.compareSync( password, userExist.password )
    if( !isPasswordCorrect ) return next( new ApiError( 
        HttpStatusCode.BAD_REQUEST,
        'Incorrect password' 
    ))

    req.userLogin = userExist
    next()
})

const validateJWT = ( req, res, next ) => {
    
    const { authorization } = req.headers

    if( !authorization || !authorization.startsWith( 'Bearer' ) ) return next( new ApiError(
        HttpStatusCode.BAD_REQUEST,
        'Invalid Token '
    ))

    const token  = authorization.split(" ")[1]
    const decoded = jwt.verify( token, process.env.JWT )


    req.sessionUser = decoded
    next()
}

const protectSession = ( req, res, next ) => {

    const user = req.sessionUser
    const { id } = req.params
    const { method } = req


    if( method === 'DELETE' ) {
        if( user.role !== 'ADMIN_ROLE' ) return next( new ApiError( 
            HttpStatusCode.UNAUTHORIZATE,
            'You are not available to do this'
        ))
    } else{
        if( user._id !== id ) return next( new ApiError(
            HttpStatusCode.UNAUTHORIZATE,
            'You are not the owner of this account'
        )) 
    }

    next()
}

const haveRole = ( ...roles ) => {
    return ( req, res, next ) => {
        
        if( !req.sessionUser ) return next( new ApiError( 
            HttpStatusCode.UNAUTHORIZATE,
            'You need to login to do this'
        ))

        if( !roles.includes( req.sessionUser.role ))return next( new ApiError( 
            HttpStatusCode.UNAUTHORIZATE,
            'You are not available to do this'
        ))

        next()
    }
}


module.exports = {
    protectLogin,
    validateJWT,
    haveRole,
    protectSession
}