const express = require('express');
const router = express.Router();
const { 
    createProduct,
    getProductById, 
    getProduct,
    photo,
    deleteProduct,
    updateProduct,
    getAllProducts,
    getAllUniqueCategories
 } = require('./../controllers/productController');

 const { isSignnedIn, isAdmin, isAuthenticated  } = require('./../controllers/authController');
 const { getUserById } = require("./../controllers/userController");


//*Params
router.param('userId', getUserById);
router.param('productId', getProductById);

//! Products Routes

//* create product
router.post('/create/:userId', isSignnedIn, isAuthenticated, isAdmin, createProduct);

//* get a single product
router.get('/product/:productId', getProduct);
router.get('/product/photo/:productId', photo, getProduct);

//* delete product
router.delete('/product/:productId/:userId', isSignnedIn, isAuthenticated , isAdmin, deleteProduct);

//* update Product
router.put('/product/:productId/:userId',  isSignnedIn, isAuthenticated , isAdmin, updateProduct);

//* get all product
router.get('/products', getAllProducts);

router.get('/product/categories', getAllUniqueCategories);


module.exports = router;