const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategoryById,
  getAllCategory,
  getCategory,
  updateCategory,
  deleteCategory
} = require("./../controllers/categoryController");

const {
  isSignnedIn,
  isAdmin,
  isAuthenticated,
} = require("./../controllers/authController");

const { getUserById } = require("./../controllers/userController");

//* Params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//! Category Routes

//* Create Category
router.post("/create/:userId", isSignnedIn, isAuthenticated, isAdmin, createCategory);
   
//* get a single Category
router.get('/:categoryId', getCategory);

//* get all Category
router.get("/", getAllCategory);

//* update Category
router.put('/:categoryId/:userId', isSignnedIn, isAuthenticated, isAdmin, updateCategory);

//* Delete Category
router.delete('/:categoryId/:userId', isSignnedIn, isAuthenticated, isAdmin, deleteCategory);

module.exports = router;