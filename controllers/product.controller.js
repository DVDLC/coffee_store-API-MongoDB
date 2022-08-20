// Models
const ProductsSchema = require("../models/Products.schema");
// Utils
const { catchAsync } = require("../utils/catchAsync");
// Helpers
const { uploadFileCloudinary } = require("../helpers/delete-upload-file");
const { ApiError } = require("../models/ApiError");

const createProduct = catchAsync( async( req, res, next ) => {

    const { name, price } = req.body
    const { sessionUser } = req
    const { id } = req.params
    const { tempFilePath } = req.files.file

    const secure_url = await uploadFileCloudinary( tempFilePath )

    const query = { 
        name: name.toUpperCase(),
        user: sessionUser._id,
        price,
        img: secure_url,
        category: id
    }

    const newProduct = await ProductsSchema.create( query )
    newProduct.save()

    res.status(201).json({
        newProduct
    })
})

const getAllProducts = catchAsync( async( req, res, next ) => {

    const { offset, limit } = req.query
    const query = { status: true }

    const [ total, products ]  = await Promise.all([
        ProductsSchema.countDocuments( query ),
        ProductsSchema.find( query )
            .skip( offset )
            .limit( limit )
            .populate({ 
                path: 'user' , 
                select: [ 'id', 'name' ]
            })
            .populate({ 
                path: 'category', 
                select: [ 'id', 'name' ]
            })
    ])  

    res.status(200).json({
        total,
        products
    })

})

const getProductByID = catchAsync( async( req, res, next ) => {

    const { id } = req.params

    const product = await ProductsSchema.findOne({ _id: id })

    res.status(200).json({
        id,
        product
    })
})

const updateProduct = catchAsync( async( req, res, next ) => {

    const { id } = req.params
    const { name, price } = req.body
    const { sessionUser } = req
    
    const product = await ProductsSchema.findById( id )
    
    if( name ){
        await product.updateOne(
            { name: name.toUpperCase(), user: sessionUser._id }, 
            { new: true }
        )
    }if( price ){
        await product.updateOne(
            { price, user: sessionUser._id }, 
            { new: true }  
        )
    }

    res.status(200).json({
        product
    })
})

const deleteProduct = catchAsync( async( req, res, next ) => {
    const { id } = req.params
    const { sessionUser } = req
    const query = { status: false, user: sessionUser._id }

    const product = await ProductsSchema.findByIdAndUpdate({ _id: id }, query)

    if( !product ) return next( new ApiError( 400, 'The porduct you are lokking for does not exist' )  )

    res.status(200).json({
        product
    })
})

module.exports = {
    createProduct,
    getAllProducts,
    getProductByID,
    updateProduct,
    deleteProduct
}