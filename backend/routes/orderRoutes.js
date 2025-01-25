const express = require('express');
const authenticate = require('../middlewares/authMiddleware.js');
const router  = express.Router();
const { createOrder, getAllOrders, getCustomerOrders, getServiceProviderOrders, findOrderById, markOrderAsDelivered, markOrderAsPaid, getShippingAddress, getTopSellingProducts, getTopSellingCategories, getServiceProviderOrderById,updateDelivery} = require('../controllers/orderController.js');

router.route('/create').post(authenticate("customer"), createOrder);
router.route('/all').get(authenticate("admin"), getAllOrders);
router.route('/customer').get(authenticate("customer"), getCustomerOrders);
router.route('/serviceprovider').get(authenticate("serviceProvider"), getServiceProviderOrders);
router.route('detail/:id').get(authenticate("customer"), findOrderById);
router.route('deliver/:id').get(authenticate("customer"), markOrderAsDelivered);
router.route('pay/:id').get(authenticate("customer"), markOrderAsPaid);
router.route('/shipping').get(authenticate("customer"), getShippingAddress);
router.route('/top-products').get(authenticate("customer"), getTopSellingProducts);
router.route('/top-categories').get(authenticate("customer"), getTopSellingCategories);
router.route('/order/:orderId').get(authenticate("serviceProvider"), getServiceProviderOrderById);
router.route('/delivery/:orderId').put(authenticate("serviceProvider"), updateDelivery);

module.exports = router;
