const { Schema, model } = require( "mongoose" );

const User = new Schema({
    name: {
        type: String,
        required: [ true, 'name is required' ]
    },
    email: {
        type: String,
        required: [ true, 'email is required' ],
        unique: true
    },
    password: {
        type: String,
        required: [ true, 'password is required' ],
    },
    img: {
        type: String
    },
    role:{
        type: String,
        required: true,
        emun: [ 'ADMIN_ROLE', 'USER_ROLE', 'SELLS_ROLE' ]
    },
    status:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    },
}) 

User.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject()
    user.uid = _id
    return user
}

module.exports = model( 'User', User )