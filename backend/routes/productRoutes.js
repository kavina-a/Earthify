const express = require('express');
const formidable = require('express-formidable');
const router = express.Router();

const authenticate = require('../middlewares/authMiddleware.js');
const { createProduct, updateProduct, removeProduct, getProducts, getProductById, getAllProducts, createReview,getTopProducts, getNewProducts, getProductsBySeller,getFilteredProducts, addToFavorites, removeFromFavorites, getFavorites} = require('../controllers/productController.js')
const { uploadSingleImage } = require('../utils/upload.js');

// router.route('/create').post(authenticate("serviceProvider"), formidable(), createProduct)
router.route('/create')
  .post(authenticate("serviceProvider"), uploadSingleImage, createProduct);

router.route('/update/:productId').put(authenticate("serviceProvider"),uploadSingleImage, updateProduct)
router.route('/delete/:productId').delete(authenticate("serviceProvider"), removeProduct)
router.route('/all6').get(authenticate("serviceProvider"), getProducts)
router.route('/detail/:productId').get(authenticate(["serviceProvider", "customer"]), getProductById)
router.route('/all').get(authenticate("serviceProvider"), getAllProducts)

//get all products listed by a particular seller
router.route('/list').get(authenticate("serviceProvider"), getProductsBySeller)

//product reviews 
router.route('/create/review/:id').post(authenticate('customer'), createReview)
router.route('/top').post(authenticate('customer'), getTopProducts)
router.route('/new').post(authenticate('customer'), getNewProducts)

//filtered products
router.route('/filtered-products').post(authenticate('customer'), getFilteredProducts)  

router.route('/favorites').get(authenticate('customer'), getFavorites)
router.route('/add-favorite/:productId').put(authenticate('customer'), addToFavorites)
router.route('/remove-favorite/:productId').put(authenticate('customer'), removeFromFavorites)


module.exports = router