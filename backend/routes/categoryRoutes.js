const express = require('express');
const authenticate = require('../middlewares/authMiddleware.js');
const { createCategory, updateCategory, deleteCategory, getCategories, getCategoryById } = require('../controllers/categoryController.js');

const router = express.Router();

//ALL OF THIS IS FOR ADMIN ONLY SO LATER GIVE ADMIN PRIVILEGES
router
    .route("/create")
    .post(authenticate('admin'), createCategory);

router
    .route("/update/:categoryId")  
    .put(authenticate("admin"), updateCategory);

router
    .route("/delete/:categoryId")   
    .delete(authenticate("admin"), deleteCategory);

router.route("/all").get(authenticate(['admin', 'serviceProvider', 'customer']), getCategories);

router.route("/:categoryId").get(authenticate(['admin', 'serviceProvider', 'customer']), getCategoryById);



module.exports = router;