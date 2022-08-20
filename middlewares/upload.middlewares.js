const { ApiError } = require('../models/ApiError');
const { HttpStatusCode } = require('../utils/http-statusCode');

const validateExtAndFiles = ( req, res, next ) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file ) return next(
        new ApiError( 
            HttpStatusCode.BAD_REQUEST,
            'No files were uploaded.'
        )
    )

    const { file } = req.files
    const nameCut = file.name.split('.')
    const extension = nameCut[ nameCut.length - 1 ]
    const validExtensions = [ 'png', 'jpg', 'jpeg', 'pdf' ]

    if( !validExtensions.includes( extension ) ) return next( new ApiError( 
        HttpStatusCode.BAD_REQUEST,
        `Invalid extension: ${ extension }`
    ))
    
    req.extension = extension
    next()
}

module.exports = {
    validateExtAndFiles
}