const express = require('express');

const router = new express.Router();
const Model = require('../model/Models')
const mongoose = require('mongoose');
router
    .route('')
    .get((req, res, next) => {
      Model.Product.find()
      .select("_id name price")//select property which you want
      .exec()
      .then(docs=>{
          const response={
              count:docs.length,
              products:docs.map(doc=>{
                  return {
                      name:doc.name,
                      price:doc.price,
                      _id:doc._id,
                      request:{
                          type:'GET',
                          url:'http://localhost:3000/products/' +doc._id
                      }
                  }
              })
          }
          res.status(200).json(response)
      })
      .catch(err=>{
          console.log(err);
          res.status(500).json({
              error:err
          })
      })
    })
    .post((req, res, next) => {
        const newProduct = new Model.Product(
            {
                _id:new mongoose.Types.ObjectId(),
                name: req.body.name,
                price: req.body.price
                
            }
        );
        newProduct.save().then(result=>{
            console.log(result);
        })
        .catch(err=>{
            next(err);
        })
        res.status(201).json({
            message: 'created product successfully',
            createdProduct: {
                name:newProduct.name,
                price:newProduct.price,
                _id:newProduct._id,
                request:{
                    type:"GET",
                    url:'http://localhost:3000/products/' +newProduct._id
                }
            }
        })
    })

router
    .route('/:productId')
    .get((req, res, next) => {
        Model.Product.findById(req.params.productId)//productId response to the ':productId of URI"
        .select('_id name price')
        .exec()
        .then(product=>{
            if(product){
                res.status(200).json({
                    _id:product._id,
                    name:product.name,
                    price:product.price,
                    request:{
                        type:"GET",
                        url:'http://localhost:3000/products/' +product._id
                    }
                });
            }else{
                res.status(404).json({message:"no volid entry"})
            }
            
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error:err})
        })
        //res.status --promise is asyn, so it will not wait then and catch 
    })

    .patch((req, res, next) => {
        const id=req.params.productId
        const updateObj={};
        for(const ops of req.body){
            updateObj[ops.propName]=ops.value;
        }
      Model.Product.update({_id:id},{$set:updateObj})
      .exec()
      .then(result=>{
         
        res.status(200).json({
            message:'Product updated',
            request:{
                type:"GET",
                url:'http://localhost:3000/products/' +id
            }
        })
      })
      .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
    })

    .delete((req, res, next) => {
        const id=req.params.productId
        Model.Product.remove({_id:id})//can use findByIdAndRemove method
        .exec()
        .then(result=>{
                res.status(200).json({
                    messsage:"deleted successfully",
                    request:{
                        type:"POST",
                        url:'http://localhost:3000/products/',
                        body:{name:"String",price:"Number"}
                    }
                })
            
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            })
        })
       
    })

module.exports = router;



