const { Schema, model } = require( "mongoose" );

const CategorySchema = new Schema({
    name: {
        type: String,
        required: [ true, 'name is required' ]
    },
    status:{
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}) 

CategorySchema.methods.toJSON = function() {
    const { __v, ...category } = this.toObject()
    return category
}

module.exports = model( 'Category', CategorySchema )