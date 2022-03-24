const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    product_name:{type: String, required: true},
    product_brand:{type: String, required: true,
    prices:{type: Number, required: true}}
},
{
    timestamps:true
})

module.exports = mongoose.model('Product', productSchema)