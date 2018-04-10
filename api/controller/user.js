const jwt=require('jsonwebtoken');
const Model = require('../model/Models');
const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');

exports.user_signup=(req,res,next)=>{
    Model.User.find({email:req.body.email})  //check user 
   
    .exec()
    .then(user=>{
       
        if(user.length>=1){ 
            return res.status(409).json({
                message:"mail existed"
            })
        }else{
            bcrypt.hash(req.body.password,8,(err,hash)=>{
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
}

exports.user_login=(req,res,next)=>{
    Model.User.find({email:req.body.email})
    .exec()
    .then(user=>{
       
        if(user.length<1){
            return res.status(404).json({
                message:"Auth failed"
            })
        }else{
            bcrypt.compare(req.body.password,user[0].password,function(err,result){
                if(err){
                    return res.status(404).json({
                        message:"Auth failed"
                    });
                 }
                 if(result){
                const token=jwt.sign({
                      email:user[0].email,
                      userId:user[0]._id
                  },
                  process.env.JWT_KEY,
                  {
                      expiresIn:"1h"
                  }
                );
                    return res.status(200).json({
                        message:'Auth Successfully',
                        token:token
                    })
                }
    
                 res.status(401).json({
                    message:"Auth failed"
                });
        
            })
        }
       

    })
    .catch(err=>{
        res.status(505).json({
            error:err
        })
     })

}

exports.delete_user_byId=(req,res,next)=>{
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
}