const productRouter=require('./products');

const orderRouter=require('./orders');

const userRoute=require("./users")
console.log("test index")
module.exports={
    productRouter:productRouter,
    orderRouter:orderRouter,
    userRoute:userRoute
}