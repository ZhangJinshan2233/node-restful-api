const express = require('express');

const router = new express.Router();

const checkAuth=require('../middleware/check-auth');

const OrdersController=require('../controller/order')
router
    .route('')
    .get(checkAuth,OrdersController.orders_get_all)
    .post(checkAuth,OrdersController.create_new_order)

router
    .route('/:orderId')
    .get(checkAuth,OrdersController.get_order_byId)

    .delete(checkAuth,OrdersController.delete_order_byId)

module.exports = router;



