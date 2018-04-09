const express = require('express');

const router = new express.Router();

const Model = require('../model/Models')
const mongoose = require('mongoose');
const bcrypt=require('bcryptjs')
router
    .route('/singup')
    .post((req,res,next)=>{
        Model.User.find({email:req.body.email})  //check user 
        .exec()
        .then(user=>{
            if(user.length>=1){ 
                return res.status(409).json({
                    message:"mail existed"
                })
            }else{
                bcrypt.hash(req.body.email,8,(err,hash)=>{
                    if(err){
                        return res.status(500).json({
                            error:err
                        })
                    }else{
                        const newUser=new Model.User({
                            _id:new mongoose.Types.ObjectId(),
                            email:req.body.email,
                            password:hash
                        });
                        newUser
                        .save()
                        .then(result=>{
                            res.status(200).json({
                                message:"User created"
                            })
                        })
                        .catch(err=>{
                            res.status(500).json({
                                error:err
                            })
                        })
                    }
                })
            }
        })
 });

 router
    .route('/:userId')
    .delete((req,res,next)=>{
        Model.User.remove({_id:req.params.userId})
        .then(result=>{
            res.status(200).json({
                message:"user deleted"
            })
        })
        .catch(err=>{
            res.status(505).json({
                error:err
            })
        })
    })
 
module.exports=router;