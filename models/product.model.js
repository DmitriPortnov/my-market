const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    productName: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    price: {
        type: Number,
        default: 0
    },
    pic_url: {
        type: String
    }
});

module.exports = Product;