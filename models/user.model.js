const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const User = new Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw Error('invalid e-mail');
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    city: {
        type: String
    },
    street: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

User.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 8);
    next();
});

module.exports = User;