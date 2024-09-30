const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');


router.route('/signup')
    .get(users.renderSignup)
    .post(catchAsync(users.signup));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', failureMessage: true, keepSessionInfo: true}), users.login);

router.get('/logout', users.logout);

module.exports = router;