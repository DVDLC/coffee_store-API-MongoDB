const CategorySchema = require("../models/Category.schema");
const { catchAsync } = require("../utils/catchAsync");

const createCategory = catchAsync( async( req, res, next ) => {
    const name = req.body.name.toUpperCase()
    const sessionUser  = req.sessionUser
    const data = { name, user: sessionUser._id }

    const newCategory = await CategorySchema.create( data )
    newCategory.save()

    res.status(201).json({
        newCategory
    })
})

const getAllCategories = catchAsync( async( req, res, next ) => {

    const { offset, limit } = req.query
    const query = { status: true }

    const [ total, categories ]  = await Promise.all([
        CategorySchema.countDocuments( query ),
        CategorySchema.find( query )
            .limit( limit )
            .skip( offset )
            .populate({
                path: 'user',
                select: [ 'id', 'name', 'img', 'role' ]
            })
    ])  

    res.status(200).json({
        total,
        categories
    })

})

const getCategoryByID = catchAsync( async( req, res, next ) => {

    const { id } = req.params

    const category  = await CategorySchema.findById( id )
        .populate({
            path: 'user',
            select: [ 'id', 'name', 'img', 'role' ]
        })


    res.status(200).json({
        category
    })
})

const updateCategory = catchAsync( async( req, res, next ) => {

    const { id } = req.params
    const { _id } = req.sessionUser
    const name  = req.body.name.toUpperCase()
    const query = { user: _id, name }

    const category = await CategorySchema.findByIdAndUpdate( id, query, { new: true } )

    res.status(200).json({
        category
    })
})

const deleteCategory = catchAsync( async( req, res, next ) => {
    const { id } = req.params
    const { _id } = req.sessionUser
    const query = { user: _id, status: false }

    const category = await CategorySchema.findByIdAndUpdate( id, query, { new: true } )
    res.status(200).json({
        category
    })
})

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryByID,
    updateCategory,
    deleteCategory
}