const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// create a schema for a products
const productSchema = new Schema({
    title: {
        type : String,
        required: true
    },
    quantity : {
        type: Number,
        required: true
    },
    description : {
        type : String,
        required: true
    },
    price : {
        type : Number,
        required : true
    }
})

module.exports = mongoose.model('Product', productSchema)