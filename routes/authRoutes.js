const express = require('express');
const router = express.Router();
const { signUp, signIn, signOut, isSignnedIn } = require('./../controllers/authController');
const { body } = require('express-validator');

router.post(
    '/signup',
    body('name').isLength({ min:4 }).withMessage('Name should be 4 characters long'),
    body('password').isLength({ min: 5 }).withMessage('Password must be 5 characters long'),
    body('email').isEmail().withMessage('Email is in wrong format'),
    signUp
);

router.post(
    '/signin',
    body('password').isLength({ min: 5 }).withMessage('Must be 5 char long'),
    body('email').isEmail().withMessage('Email is in wrong format'),
    signIn
);

router.get('/signout', signOut);


module.exports = router;