
const mongoose=require('mongoose');
mongoose
.connect('mongodb://localhost/nodeRestShop')
.then(()=>{
    console.log('connect to mongodb')
})
.catch(err=>{
    console.log(err.message);
})

mongoose.set('debug',true);

mongoose.Promise=global.Promise;

//refer all models
var Product=require('./Product');

var Order=require('./Order');

module.exports={
    Product:Product,
    Order:Order
}