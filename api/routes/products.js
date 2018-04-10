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
const checkAuth=require('../middleware/check-auth');
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

const productController=require('../controller/product')
router
    .route('')
    .get(productController.get_all_products)
    .post(checkAuth, upload.single("productImage"),productController.create_new_product)

router
    .route('/:productId')
    .get(productController.get_product_byId)
    .patch(checkAuth,productController.update_product_byId)

    .delete(checkAuth,productController.delete_product_byId)

module.exports = router;



