const mongoose = require('mongoose');
const cartProductSchema = require('../models/cartItem.model');
const CartProduct = mongoose.model('cart-product', cartProductSchema);

const cartValidation = {
    checkProductsInCart: async (req, res, next) => {
        const {productId, cartId} = req.params;
        const existedProduct = await CartProduct.findOne({productId, cartId});
        if (existedProduct) {
            return res.status(400).json({error: 'this product allready in cart'});
        }
        return next();
    }
}

module.exports = cartValidation;