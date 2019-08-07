const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = new Schema({
    categoryName: {
        type: String
    }
})

module.exports = Category;