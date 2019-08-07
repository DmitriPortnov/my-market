const express = require('express');

const cartValidation = require('../validation/cart.validation');
const cartService = require('../service/cart.service');

const router = express.Router();

router.get('/num-of-carts', cartService.getAllCarts);
router.get('/get-last-cart/:customerId', cartService.getLastCart);
router.get('/customers-cart/:customerId', cartService.customersCart);
router.get('/cart-products/:cartId', cartService.getCartProducts);
router.put('/add-product/:cartId/:productId', cartValidation.checkProductsInCart, cartService.addProductToCart);
router.patch('/update-product/:cartProductId', cartService.updateCartProduct);
router.delete('/delete-product/:cartProductId', cartService.deleteCartProduct);
router.delete('/delete-all-products/:cartId', cartService.deleteAllCartProduct);

module.exports = router;