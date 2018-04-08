const productRouter=require('./products');

const orderRouter=require('./orders');
console.log("test index")
module.exports={
    productRouter:productRouter,
    orderRouter:orderRouter
}