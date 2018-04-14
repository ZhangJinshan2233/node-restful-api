
const mongoose=require('mongoose');
mongoose
.connect('mongodb://nodeRestfulShop:1234567890@ds241699.mlab.com:41699/node-rest-shop')
//'mongodb://localhost/nodeRestShop' local mpngodb
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

var User=require('./User')
module.exports={
    Product:Product,
    Order:Order,
    User:User
}