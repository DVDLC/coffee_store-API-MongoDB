// libraries
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL )
// Utils
const { catchAsync } = require("../utils/catchAsync");
// Helpers
const { updateUserAndProductFile } = require('../helpers/delete-upload-file');
// Models
const UserSchema = require("../models/User.schema");
const ProductsSchema = require("../models/Products.schema");



const updateProductFileCloudinary = catchAsync( async( req, res, next ) => {

    const { id } = req.params
    const { tempFilePath } = req.files.file

    const product = await ProductsSchema.findById({ _id: id })
    const secure_url = await updateUserAndProductFile( product, tempFilePath )

    product.img = secure_url
    await product.save()

    res.status( 200 ).json({
        product
    })

})

// Upload and update files in cloud

const updateUserFileCloudinary = catchAsync( async( req, res, next ) => {

    const { id } = req.params
    const { tempFilePath } = req.files.file
  
    const user = await UserSchema.findById({ _id: id })
    const secure_url = await updateUserAndProductFile( user, tempFilePath )

    user.img = secure_url
    await user.save()

    res.status( 200 ).json({
        user
    })
})



module.exports = {
    updateProductFileCloudinary,
    updateUserFileCloudinary
}