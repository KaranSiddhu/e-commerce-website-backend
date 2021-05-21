const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productCartSchema =  new mongoose.Schema({
    product:{
        type:ObjectId,
        ref:"Product"
    },
    name:String,
    count:Number,
    price:Number

}, {timestamps:true});

const orderSchema = new mongoose.Schema({
    products:[productCartSchema],
    transaction_id:{

    },
    amount:{
        type:Number
    },
    address:{
        type:String,
        maxLength:2000
    },
    updated: Date,
    status: {
        type: String,
        enum:["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"],
        default:'Recieved'
    },
    user:{
        type:ObjectId,
        ref:"User"
    }

}, {timestamps:true});

const Order =  mongoose.model('Order', orderSchema);
const ProductCartSchema = mongoose.model('ProductCart', productCartSchema);

module.exports = {Order, ProductCartSchema};