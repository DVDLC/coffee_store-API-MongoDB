const jwt = require('jsonwebtoken')

const generateJWT = ( payload ) => {
    
    const token = jwt.sign( 
        payload,
        process.env.JWT, 
        { expiresIn: '12h' } 
    )

    return token
}

module.exports = {
    generateJWT
}