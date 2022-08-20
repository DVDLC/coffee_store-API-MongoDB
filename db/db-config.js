const mongoose = require('mongoose')


const dbConnection = async( ) => {

    try{
        await mongoose.connect( process.env.MDB_CNN, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )
    
        console.log('DB is authenticated and online')
    }catch(err){
        console.log( 'Error to connect to DB', err )
    }
}

module.exports = {
    dbConnection
}