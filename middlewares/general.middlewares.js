// Libraries
const { default: mongoose } = require("mongoose");
const { ApiError } = require("../models/ApiError");
const { HttpStatusCode } = require("../utils/http-statusCode");

const validateMongoID = ( req, res, next ) => {

    const { id } = req.params 
    const isValid = mongoose.Types.ObjectId.isValid( id )

    if( !isValid ) return next( new ApiError( 
        HttpStatusCode.NOT_FOUND,
        'Not valid Id' 
    ))

    next()
}

module.exports = {
    validateMongoID
}