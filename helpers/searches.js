const { default: mongoose } = require("mongoose")

const prodAndCtgy = ( model, term ) => {
    if( mongoose.Types.ObjectId.isValid( term ) ){
        return model.find({ _id: term, status: true })
    }else{
        const regex = new RegExp( term, 'i' )
        return model.find({ name: regex, status: true })
    }
}

const user = ( model, term ) => {

    if( mongoose.Types.ObjectId.isValid( term ) ){
        return model.find({ _id: term, status: true })
    }else{
        const regex = new RegExp( term, 'i' )
        return model.find({ 
            $or: [{ name: regex }, { email: regex }],
            $and: [{ status: true }] 
        })
    }
}

module.exports = {
    prodAndCtgy,
    user
}