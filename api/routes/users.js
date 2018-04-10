const express = require('express');
const router = new express.Router();
const checkAuth=require('../middleware/check-auth');
userController=require('../controller/user');

router
    .route('/signup')
    .post(userController.user_signup);

 router
    .route('/login')
    .post(userController.user_login)

 router
    .route('/:userId')
    .delete( checkAuth,userController.delete_user_byId)
 
module.exports=router;
