const express = require('express');
const {createCustomer, createServiceProvider, loginUser, logoutUser, getCurrentUserProfile, updateCurrentUserProfile, deleteUser, getEcoPoints, getCurrentProfile} = require("../controllers/userController.js");
const authenticate = require('../middlewares/authMiddleware.js');

const router = express.Router()

router.route("/create/customer").post(createCustomer) //create customer account
router.route("/create/service-provider").post(createServiceProvider) //create sp account

router.post("/auth", loginUser); //login from customer or sp

router.post("/logout", authenticate(), logoutUser) //logout

router
    .route("/profile")
    .get(authenticate(), getCurrentUserProfile)
    .put(authenticate(), updateCurrentUserProfile); //get and update user profile

router.route('/:id').delete(authenticate(), deleteUser) //this is an admin ability 
router.route('/eco-points').get(authenticate('customer'), getEcoPoints) //get eco points

router.route('/current/profile').get(authenticate(), getCurrentProfile) //get current profile


module.exports = router;