const mongoose = require('mongoose');
const userSchema = require('../models/user.model');
const User = mongoose.model('User', userSchema);
const validator = require('validator');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const userConfig = {
    auth: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.status(401).json({isLoggedIn: false});
    },
    login: (email, password, done) => {
        User.findOne({ email }, async (err, user) => {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false)
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false)
            }
            return done(null, user);
        });
    },
    beforeSignup: (req, res, next) => {
        const { email, password } = req.body;
        if (email === undefined) {
            return res.status(400).json({userError: "please put your email"});
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({userError: "email incorrect"});
        }
        if (password.length < 5) {
            return res.status(400).json({userError: "password to short, must be at least 6 characters"});
        }
        User.findOne({email: email}, (err, user) => {
            console.log('user ***************************', user);
            if (err) {
                return res.status(400).json('something wrong');
            }
            if (user) {
                return res.send('this user allready exists');
            }
            return next();
        });
    },
    signup: (req, res, next) => {
        const inputsforCheck = _.filter(req.body, input => _.isString(input));
        if (!_.every(_.map(inputsforCheck, input => !_.isEmpty(input)))) {
            return res.status(400).json({userError: "please fill all the inputs"});
        }
        const newUser = new User(req.body);
        newUser.save(err => {
            if (err) {
                return res.status(400).json('something wrong');
            }
            return next();
        });
    },
    serial: (user, done) => done(null, user),
    deSerial: (user, done) => done(null, user)
}

module.exports = userConfig;