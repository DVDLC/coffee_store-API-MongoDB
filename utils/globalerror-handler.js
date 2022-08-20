const { ApiError } = require('../models/ApiError')
const { HttpStatusCode } = require('./http-statusCode')
require('dotenv').config()

const globalErrorHandler = (err, req, res, next) => {
    
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'fail'   
    
    const sendErrorDev = ( err, req, next ) => {
        res.status( err.statusCode ).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack
        })
    }
    
    const sendErrorProd = ( err, req, next ) => {
        res.status( err.statusCode ).json({
            status: err.status,
            error: err
        })
    }
    
    const handlerMoongoseUniqueError = ( value ) => {
        return new ApiError( HttpStatusCode.BAD_REQUEST, `${ value } is already exist` )
    }

    const handlerExpiredTokenError = () => {
        return new ApiError( HttpStatusCode.UNAUTHORIZATE, 'You are not available to do this - you have to login' )
    }

    const handlerGoogleTokenError = () => {
        return new ApiError( HttpStatusCode.UNAUTHORIZATE, 'Invalid google token' )
    }


    if( process.env.NODE_ENV === 'development' ) {

        if( err.message === 'jwt expired' ){
            err = handlerExpiredTokenError()
        }else if( err.message === `Wrong number of segments in token: ${ req.body.id_token }` ){
            err = handlerGoogleTokenError()
        }

        sendErrorDev( err, req, next )
        
    }if( process.env.NODE_ENV === 'production' ){
        
        let error = { ...err }

        // Moongoe validaton error

        if( error.code === 11000 ){
            error = handlerMoongoseUniqueError( Object.keys(error.keyValue)[0] )
        }else if( error.message === 'jwt expired' ){
            error = handlerExpiredTokenError()
        }else if( error.message === `Wrong number of segments in token: ${ req.body.id_token }` ){
            error = handlerGoogleTokenError()
        }

        sendErrorProd( error, req, next ) 
    }
}

module.exports = {
    globalErrorHandler
}