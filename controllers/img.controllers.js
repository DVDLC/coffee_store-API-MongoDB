// Nodejs
const path = require('path')


const showImgs = ( req, res, next ) => {

    const { collection } = req.params
    const { model } = req
    let pathImg

    if( model.img ){
        pathImg = path.join( __dirname, '../uploads', collection, model.img )
        return res.sendFile( pathImg )
    }

    pathImg = path.join( __dirname, '../assets/notExist/no-image.jpg' )

    res.sendFile( pathImg )

}

module.exports = {
    showImgs
}