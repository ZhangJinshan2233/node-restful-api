const express = require('express');

const router = new express.Router();

router
    .route('')
    .get((req, res, next) => {
        res.status(200).json({
            message: 'handle Get to /orders method'
        })
    })
    .post((req, res, next) => {
        const newOrder = {
            productId: req.body.productId,
            quantity: req.body.quantity
        }
        res.status(200).json({
            message: 'handle POST to /orders method',
            newOrder: newOrder
        })
    })

router
    .route('/:orderId')
    .get((req, res, next) => {
        const id = req.params.orderId;
        res.status(200).json({
            message: 'you discovered special id',
            id: id
        })
    })

    .patch((req, res, next) => {
        res.status(200).json({
            message: "order updated"
        })
    })

    .delete((req, res, next) => {
        res.status(200).json({
            message: "delete order"
        })
    })

module.exports = router;



