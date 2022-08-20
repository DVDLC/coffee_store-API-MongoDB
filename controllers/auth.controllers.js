
const { generateJWT } = require('../helpers/generate-jwt')
const { googleVerify } = require('../helpers/google-verify')
const UserSchema = require('../models/User.schema')
const { catchAsync } = require('../utils/catchAsync')

const login = ( req, res, next ) => {

    const { _id, name, role } = req.userLogin
    const payload = { _id, name, role }
    const token = generateJWT( payload )

    res.status( 200 ).json({
        token
    })
}

const googleSignIn = catchAsync(async( req, res, next ) => {
    const { id_token } = req.body


    const { name, email, img } = await googleVerify( id_token )

    let googleUser = await UserSchema.findOne({ email })
    if( !googleUser ){
        const data = {
            name,
            email,
            img,
            password: ":p",
            role: 'USER_ROLE',
            google: true
        }

        googleUser = await UserSchema.create( data )
        await googleUser.save()
    }
    
    const payload = { 
        _id: googleUser._id, 
        name: googleUser.name, 
        role: googleUser.role 
    }
    const token = generateJWT( payload )

    res.json({
        email,
        token
    })
})

module.exports = {
    login,
    googleSignIn
}