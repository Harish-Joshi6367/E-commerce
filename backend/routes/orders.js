const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { placeOrder, getOrders, getOrderHistoryForUser } = require('../controllers/orderController');

router.post('/', auth, placeOrder); // place order
router.get('/history', auth, getOrderHistoryForUser); // orders for logged-in shop
router.get('/', auth, getOrders); // admin view all orders

module.exports = router;
