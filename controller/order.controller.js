const express = require('express');

const orderService = require('../service/order.service');
const orderValidation = require('../validation/order.validation');
const auth = require('../validation/userConfig');

const router = express.Router();

router.put('/newOrder', auth.auth, orderValidation.checkOrderDetails, orderService.createOrder);
router.get('/pdf/:cartId', auth.auth, orderService.downloadPDF);

module.exports = router;