const _ = require('lodash');

const OrderValidation = {
    checkOrderDetails:async (req, res, next) => {
        if (!_.every(_.map(_.omit(req.body, 'finalPrice'), input => !_.isEmpty(input))) && _.isNumber(req.body.finalPrice)) {
            return res.status(400).json('please fill all the inputs');
        }
        next();
    }
}

module.exports = OrderValidation;