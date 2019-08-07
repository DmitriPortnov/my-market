const express = require('express');

const upload = require('../validation/image.validation');
const productService = require('../service/product.service');
const productValidation = require('../validation/product.validation');
const auth = require('../validation/userConfig');

const router = express.Router();

router.get('/num-of-products', productService.numOfProducts);
router.get('/get-rand-product', productService.randProduct);
router.get('/get-products/:categoryId', productService.getProducts);
router.get('/get-category', productService.getCategory);
router.post('/search', productService.searchProducts);
router.put('/add-product', auth.auth, upload.single('product_img'), productValidation.checkInputs, productService.addProduct, productService.errorHandler);
router.patch('/update-product/:productId', auth.auth, upload.single('product_img'), productService.updateProduct, productService.errorHandler);
module.exports = router;