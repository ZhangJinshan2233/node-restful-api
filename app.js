//require installed module
const express=require('express');

const morgan=require('morgan')

const bodyParser=require('body-parser');

const app=express();
//refer products router
const routers=require('./api/routes/routes');

app.use(morgan('dev'));
//set CORS =cross orign resource sharing
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','origin,X-Requested-With,Content-Type,Accept,Authorization');
    if(req.method==='OPTIONS'){ 
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET')
        return res.status(200).json({});
    }
    next(); //if statements block our incoming request,so if we are not immediately returning 
            //due to us getting options requests, so other can take over.

})

app.use(bodyParser.urlencoded({extended:true}));//receive url format
app.use(bodyParser.json()); //receive json format
app.use('/products',routers.productRouter);

app.use('/orders',routers.orderRouter)

app.use((req,res,next)=>{
    const err=new Error("No found");
    err.status=404;
    next(err);
})

app.use((err,req,res,next)=>{
    res.status(err.status||500);
    res.json({
        error:{
            message:err.message
        }
    })
    
})
module.exports=app;