const express = require('express');
const { createAOrder, getOrderByEmail, getAllOrders, updateOrderStatus } = require('./order.controller');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

const router =  express.Router();

// create order endpoint (protected)
router.post("/", verifyToken, createAOrder);

// get orders by user email
router.get("/email/:email", getOrderByEmail);

// admin: get all orders
router.get("/", verifyToken, verifyAdmin, getAllOrders);

// admin: update order status
router.patch("/:id/status", verifyToken, verifyAdmin, updateOrderStatus);

module.exports = router;