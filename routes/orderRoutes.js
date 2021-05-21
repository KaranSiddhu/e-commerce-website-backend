const express = require('express');
const router = express.Router();
const { 
    getOrderById, 
    createOrder, 
    getAllOrders, 
    getOrderStatus, 
    updateStatus
 } = require('../controllers/orderController');

const { isSignnedIn, isAdmin, isAuthenticated  } = require('./../controllers/authController');

const { getUserById, pushOrderInPurchaseList } = require("./../controllers/userController");

const { updateInventory } = require('./../controllers/productController');

router.param('userId', getUserById);
router.param('orderId', getOrderById);

//* create order
router.post(
    '/order/create/:userId', 
    isSignnedIn,
    isAuthenticated, 
    pushOrderInPurchaseList,
    updateInventory, 
    createOrder
);


//* get order
router.get('/order/all/:userId', isSignnedIn, isAuthenticated, isAdmin, getAllOrders);

//* order status
router.get('/order/status/:userId', isSignnedIn, isAuthenticated, isAdmin, getOrderStatus);

//* update order
router.put('/order/:orderId/status/:userId', isSignnedIn, isAuthenticated, isAdmin, updateStatus);

module.exports = router;