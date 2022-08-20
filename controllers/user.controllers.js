// Libraries
const bcrypt = require('bcryptjs')
// Utils
const { catchAsync } = require("../utils/catchAsync");
// Models
const UserSchema = require("../models/User.schema");
const { uploadFileCloudinary } = require('../helpers/delete-upload-file');

const getUsers = catchAsync( async( req, res, next ) => {

    const { limit, offset } = req.query
    const query = { status: true }

    const [ total, users ] = await Promise.all( [
        UserSchema.countDocuments( query ),
        UserSchema.find( query )
            .skip( offset )
            .limit( limit )
    ])

    res.status(200).json({
       total,
       users
    })
})

const postUser = catchAsync( async( req, res, next ) => {

    let { password, google, status, ...props } = req.body
    const { tempFilePath } = req.files.file

    const salt = bcrypt.genSaltSync( 10 )
    password = bcrypt.hashSync( password, salt )

    const secure_url = await uploadFileCloudinary( tempFilePath )

    const nwUser = await UserSchema.create({ password, img: secure_url, ...props })
    await nwUser.save()

    res.status(200).json({
        nwUser
    })
})

const updateUser = catchAsync( async( req, res, next ) => {

    const { id } = req.params

    let { _id, password, google, ...rest } = req.body

    if( password ){
        const salt = bcrypt.genSaltSync( 10 )
        password = bcrypt.hashSync( password, salt )
    }

    const userDB = await UserSchema.findByIdAndUpdate( id, { ...rest }, { new: true } )

    res.status(200).json({
        userDB
    })
})

const deleteUser = catchAsync( async( req, res, next ) => {

    const { id } = req.params

    const userDB = await UserSchema.findByIdAndUpdate( id, { status: false }, { new: true } )

    res.status(200).json({
        userDB
    })
})

module.exports = {
    getUsers,
    postUser,
    updateUser,
    deleteUser
}