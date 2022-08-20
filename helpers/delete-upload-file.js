// Libraries
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL )

const uploadFileCloudinary = async( tempFilePath ) => {
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )
    return secure_url
}

const deleteFileCloudinary = ( modelImg ) => {
    if( modelImg ){
        const fileArr = modelImg.split('/')
        const file = fileArr[ fileArr.length - 1 ]
        const [ public_id ] = file.split('.')

        cloudinary.uploader.destroy( public_id )
    }
}

const updateUserAndProductFile = async( model, tempFilePath ) => {

    const { img } = model
    // Hacer el upload de la imagen a cloudinary
    const secure_url = await uploadFileCloudinary( tempFilePath )
    deleteFileCloudinary( img )

    return secure_url
}

module.exports = {
    uploadFileCloudinary,
    deleteFileCloudinary,
    updateUserAndProductFile
}