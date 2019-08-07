const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Cart = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    finishedCart: {
        type: Boolean,
        default: false
    }
})

module.exports = Cart;