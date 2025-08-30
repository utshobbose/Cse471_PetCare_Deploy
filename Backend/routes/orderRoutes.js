const express = require('express');
const router = express.Router();
const authUser = require('../middleware/auth'); 

const {
    placeOrder,              
    placeOrderStripe,        // Stripe create session
    verifyStripe,            // Stripe verify & clear cart
    placeOrderRazorpay,      // Razorpay create order
    verifyRazorpay,          // Razorpay verify & clear cart
    allOrders,
    userOrders,
    updateStatus,
} = require('../controller/orderController');

router.post('/place', authUser, placeOrder);

// Stripe
router.post('/stripe', authUser, placeOrderStripe);
router.post('/stripe/verify', authUser, verifyStripe);

// Razorpay
router.post('/razorpay', authUser, placeOrderRazorpay);
router.post('/razorpay/verify', authUser, verifyRazorpay);

// Optional:
router.get('/all', allOrders);
router.post('/mine', authUser, userOrders);
router.post('/status', updateStatus);

module.exports = router;
