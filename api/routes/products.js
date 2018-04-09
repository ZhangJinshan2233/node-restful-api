const express = require('express');

const router = new express.Router();
const Model = require('../model/Models')
const mongoose = require('mongoose');
const multer=require('multer');
const storage=multer.diskStorage({
    destination:function(req,file,cb){//req,file,callback automatically are provided by multer
        cb(null,'./upload/')//null:potential is none; and the path you want to store
    },
    filename:function(req,file,cb){//defines how the file should be named
        cb(null,file.originalname);
    }
});//how stroe this file and the types of file

const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/jpeg'||file.mimetype==='image/png'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
const upload=multer({
    storage:storage,
    limits:{
    fileSize:1024*1024*5},
    fileFilter:fileFilter
});//dest:"upload/"
router
    .route('')
    .get((req, res, next) => {
      Model.Product.find()
      .select("_id name price productImage")//select property which you want
      .exec()
      .then(docs=>{
          const response={
              count:docs.length,
              products:docs.map(doc=>{
                  return {
                      name:doc.name,
                      price:doc.price,
                      _id:doc._id,
                      productImage:doc.productImage,
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
    .post(upload.single("productImage"),(req, res, next) => {
       console.log(req.file);
        const newProduct = new Model.Product(
            {
                _id:new mongoose.Types.ObjectId(),
                name: req.body.name,
                price: req.body.price,
                productImage:req.file.path
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
                productImage:req.file.path,
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
        .select('_id name price productImage')
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



