const express = require('express');
const router = express.Router();
const {
    getUserById,
    getUser,
    updateUser, 
    userPurchaseList 
} = require('./../controllers/userController');

const { isSignnedIn, isAdmin, isAuthenticated  } = require('./../controllers/authController');

router.param('userId', getUserById);

router.get('/:userId', isSignnedIn, isAuthenticated, getUser);

router.put('/:userId', isSignnedIn, isAuthenticated, updateUser);

router.get('/orders/:userId', isSignnedIn, isAuthenticated, userPurchaseList);

module.exports = router;