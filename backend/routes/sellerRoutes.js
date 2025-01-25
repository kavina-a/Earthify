const express = require('express');
const formidable = require('express-formidable');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware.js');

// Importing the controllers
const { getSellerAnalytics } = require('../controllers/sellerController');

router.route('/chart/analytics').get(authenticate("serviceProvider"), getSellerAnalytics);

module.exports = router;
