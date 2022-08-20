// Libraries
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const compression = require('compression')
const { default: helmet } = require('helmet')
const fileUpload = require('express-fileupload')
// ENV
require('dotenv').config()
// utils
const { globalErrorHandler } = require('./utils/globalerror-handler')
const { HttpStatusCode } = require('./utils/http-statusCode')
// Models
const { ApiError } = require('./models/ApiError')
const { dbConnection } = require('./db/db-config')


class Server{
    constructor(){
        this.app = express()
        this.PORT = process.env.PORT || 4000
        this.paths = {
            auth:       '/api/v1/auth',
            users:      '/api/v1/users',
            categories: '/api/v1/categories',
            products:   '/api/v1/products',
            search:     '/api/v1/search',
            upload:     '/api/v1/upload',
            img:        '/api/v1/img',
            error:      '*'    
        }

        this.DBconnection()

        this.middlewares()

        this.routes()

        this.notFound()

        this.errorHandler()
    }

    middlewares(){
        this.app.use( cors() )

        this.app.use( express.json() )

        this.app.use( express.static( 'public' ) )

        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }))

        if( process.env.NODE_ENV === 'production' ){
            this.app.use( helmet() )
            this.app.use( compression() )
        }
        else{
            this.app.use( morgan('dev') )
        }
    }

    routes(){
        this.app.use( this.paths.auth, require( './routes/auth.routes' ) )
        this.app.use( this.paths.users, require( './routes/user.routes' ) )
        this.app.use( this.paths.categories, require( './routes/categories.routes' ) )
        this.app.use( this.paths.products, require( './routes/products.routes' ) )
        this.app.use( this.paths.search, require( './routes/search.routes' ) )
        this.app.use( this.paths.upload, require( './routes/upload.routes' ) )
        this.app.use( this.paths.img, require( './routes/img.routes' ) )
    }

    notFound(){
        this.app.all( this.paths.error, ( req, res, next ) => {
            next(  
                new ApiError(
                    HttpStatusCode.BAD_REQUEST, 
                    `${ req.method } ${ req.originalUrl } is not found`
                )
            )
        })
    }

    errorHandler(){
        this.app.use( globalErrorHandler )
    }

    async DBconnection(){
        await dbConnection()
    }

    listen(){
        this.app.listen( this.PORT, () => {
            console.log( `Server running at port: ${ this.PORT }` )
        })
    }

}

module.exports = Server