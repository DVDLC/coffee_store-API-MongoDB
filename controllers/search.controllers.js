// Models
const CategorySchema = require("../models/Category.schema")
const ProductsSchema = require("../models/Products.schema")
const UserSchema = require("../models/User.schema")
// helpers
const { prodAndCtgy, user } = require("../helpers/searches")
// Utils
const { catchAsync } = require("../utils/catchAsync")


const search = catchAsync(async( req, res, next ) => {
    const { collection, term } = req.params
    let result

    switch ( collection ) {
        case 'product':
            result = await prodAndCtgy( ProductsSchema, term )
            break;
        case 'category':
            result = await prodAndCtgy( CategorySchema, term )
            break;
        default:
            break;
    }

    res.status( 200 ).json({
        results: result
            ? result
            : []
    })
})

const adminSearch = catchAsync( async( req, res, next ) => {
    const { term } = req.params
    let result

    result = await user( UserSchema, term ) 

    res.status( 200 ).json({
        results: result
            ? result
            : []
    })
})



module.exports = {
    search,
    adminSearch
}
