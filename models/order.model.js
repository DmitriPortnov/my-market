const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    },
    finalPrice: {
        type: Number
    },
    city: {
        type: String
    },
    ctreet: {
        type: String
    },
    delivaryDate: {
        type: Date
    },
    orderDate: {
        type: Date,
        default: Date.now()
    },
    creditCard: {
        type: String
    }
});

module.exports = Order;