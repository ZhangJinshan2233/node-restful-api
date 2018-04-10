
const Model = require('../model/Models');
const mongoose = require('mongoose');

exports.orders_get_all=(req, res, next) => {
    Model.Order
    .find()
    .select('_id product quantity')
    .populate('product','name')//get the whole properties of Product in the order,
                     //name is one of the property of Product
    .exec()
    .then(docs=>{
        res.status(200).json({
            count:docs.length,
            orders:docs.map(doc=>{
             return {
                 _id:doc._id,
                 product:doc.product,
                 quantity:doc.quantity,
                 request:{
                    type:"GET",
                    url:"http://localhost:3000/orders"+doc._id
                }
             }  
            })
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
}

exports.create_new_order=(req, res, next) => {
    Model.Product.findById(req.body.productId)
    .then(result=>{
        if(!result){
            return res.status(500).json({
                message:"product not found"
            })
        }
        const newOrder =new Model.Order(
            {
                _id:new mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            }
        );
        return newOrder.save()//return a promise which will be used by next then()
    })
    .then(result=>{
        console.log(result)            
        res.status(200).json({
            message:'order stored',
            createdOrder:{
                _id:result._id,
                product:result.product,
                quantity:result.quantity
            },
            request:{
                type:"GET",
                url:"http://localhost:3000/orders"+result._id
            }
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
}

exports.get_order_byId=(req, res, next) => {
    Model.Order.findById(req.params.orderId)
    .select('_id product quantity')
    .populate('product')
    .exec()
    .then(orderDoc=>{
        if(!orderDoc){
            return res.status(404).json({
                message:"order not founds"
            })
        }
          res.status(200).json({
              message:"get a order",
              order:{
                  _id:orderDoc._id,
                  product:orderDoc.product,
                  quantity:orderDoc.quantity
              },
              request:{
                  type:"GET",
                  url:"http://localhost:3000/orders/"+orderDoc._id
              }
          })
    })
    .catch(err=>{
        res.status(500).json({
            message:"not found",
            error:err
        })
    })
  }

  exports.delete_order_byId=(req, res, next) => {
    Model.Order.remove({_id:req.params.orderId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:"order deleted",
            request:{
                type:"POST",
                url:"http://localhost:3000/orders",
                body:{
                    productId:"String",
                    quantity:"Number"
                }
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
 }