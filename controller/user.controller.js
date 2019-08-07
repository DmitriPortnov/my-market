const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();

const userValidate = require('../validation/userConfig');
const userService = require('../service/user.service');

passport.use('login', new LocalStrategy(userValidate.login));

passport.serializeUser(userValidate.serial);
passport.deserializeUser(userValidate.deSerial);

router.get('/is-logged-in', userValidate.auth, userService.isLogedIn);
router.post('/login', passport.authenticate('login'), userService.login);
router.post('/check-user', userValidate.beforeSignup, userService.beforeSignUp);
router.put('/signup', userValidate.signup, userService.signup);

module.exports = router;