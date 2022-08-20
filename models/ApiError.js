class ApiError extends Error{

    constructor( statusCode, msg ){
        super( msg )

        this.msg = msg;
        this.statusCode = statusCode;
		this.status = `${ statusCode }`.startsWith('5') ? 'fail' : 'error';

		Error.captureStackTrace(this, this.constructor);
    } 
}


module.exports = {
    ApiError
}