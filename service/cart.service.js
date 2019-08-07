const mongoose = require('mongoose');
const cartSchema = require('../models/cart.model');
const Cart = mongoose.model('cart', cartSchema);
const cartProductSchema = require('../models/cartItem.model');
const CartProduct = mongoose.model('cart-product', cartProductSchema);
const productSchema = require('../models/product.model');
const Product = mongoose.model('Product', productSchema);
const orderSchema = require('../models/order.model');
const Order = mongoose.model('Order', orderSchema);

const cartService = {
    getAllCarts: (req, res) => {
        Cart.find({}, (err, carts) => {
            return err? res.status(400).json({errorMessage: err}): res.send({numOfCarts: carts.length});
        });
    },
    getLastCart: (req, res) => {
        Cart.find({customer: req.params.customerId}, (err, data) => {
            if (err) {
                return res.status(400).json({errorMessage: 'something wrong'});
            }
            const openCart = data.find(cart => cart.finishedCart === false);
            if (data.length === 0) {
                return res.send({userMessage: "welcome to your first shopping.",
                    cart: null
                });
            }
            if (openCart !== undefined) {
                return res.send({userMessage: "you have open cart from",
                cart: openCart.date});
            }
            let lastCart = new Date(0);
            let lastCartId;
            data.forEach(cart => {
                if (cart.date > lastCart) {
                    lastCart = cart.date;
                    lastCartId = cart._id;
                }
            });
            Order.findOne({cartId: lastCartId}, (err, data) => {
                return err? res.status(400).json('something wrong') :
                res.send({userMessage: "your last shopping was on", cart: new Date(data.orderDate)
            });
            });
        });
    },
    customersCart: async (req, res) => {
        const {customerId} = req.params;
        const cart = await Cart.findOne({customer: customerId, finishedCart: false});
        if (!cart) {
            const newCart = new Cart({
                customer: customerId
            });
            await newCart.save();
            return res.send(newCart);
        }
        return res.send(cart);
    },
    addProductToCart: async (req, res) => {
        const {quantity} = req.body;
        const {productId, cartId} = req.params;
        const product = await Product.findOne({_id: productId});
        const newCartProduct = new CartProduct({
            productId: product._id,
            quantity,
            totPrice: Math.ceil(product.price*quantity * 100) / 100,
            cartId
        });
        await newCartProduct.save();
        return res.send(newCartProduct);
    },
    getCartProducts: (req, res) => {
        CartProduct.find({cartId: req.params.cartId}).populate('productId').exec((err, data) => {
            return err ? res.status(400).json('something wrong'): res.send(data);
        });
    },
    updateCartProduct: (req, res) => {
        CartProduct.findByIdAndUpdate(req.params.cartProductId, req.body, {useFindAndModify: false}, (err, data) => {
            console.log(data);
            return err? res.status(400).json('some error') : res.send(data);
        });
    },
    deleteCartProduct: (req, res) => {
        CartProduct.findByIdAndRemove(req.params.cartProductId, {useFindAndModify: false}, (err, data) => {
            return err? res.status(400).json("some thing wrong") : res.send(data);
        });
    },
    deleteAllCartProduct: (req, res) => {
        CartProduct.deleteMany({cartId: req.params.cartId}, err => {
            return err? res.status(400).json('something wrong') : res.status(200).json("success");
        });
    }
}

module.exports = cartService;