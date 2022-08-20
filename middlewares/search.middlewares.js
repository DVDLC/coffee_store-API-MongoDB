const { ApiError } = require("../models/ApiError")
const { HttpStatusCode } = require("../utils/http-statusCode")


const validCollection = ( arrCollection ) => {
    return ( req, res, next ) => {

        const { collection } = req.params

        if( !arrCollection.includes( collection ) ) return next( 
            new ApiError(
                HttpStatusCode.NOT_FOUND,
                `${ collection } is not a valid collection - ${ arrCollection }`
            )
        )
    
        next()
    }
}

module.exports = {
    validCollection
}