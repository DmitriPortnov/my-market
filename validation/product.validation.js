const _ = require('lodash');

const productValidation = {
    checkInputs: (req, res, next) => {
        if (!_.every(_.forEach(req.body, input => _.isEmpty(input))) || req.file === undefined) {
            throw new Error("please fill the inputs");
        }
        return next();
    }
}

module.exports = productValidation;