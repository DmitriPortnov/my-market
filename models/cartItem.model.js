const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItem = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        min: 1
    },
    totPrice: {
        type: Number
    },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    }
});

module.exports = CartItem;