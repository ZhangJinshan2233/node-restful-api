
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

var Product=require('./Product');

module.exports={
    Product:Product
}