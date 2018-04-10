const Model = require('../model/Models');
const mongoose = require('mongoose');

exports.get_all_products=(req, res, next) => {
    Model.Product.find()
    .select("_id name price productImage")//select property which you want
    .exec()
    .then(docs=>{
        const response={
            count:docs.length,
            products:docs.map(doc=>{
                return {
                    name:doc.name,
                    price:doc.price,
                    _id:doc._id,
                    productImage:doc.productImage,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/products/' +doc._id
                    }
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
  }

  exports.create_new_product=(req, res, next) => {
    console.log(req.file);
     const newProduct = new Model.Product(
         {
             _id:new mongoose.Types.ObjectId(),
             name: req.body.name,
             price: req.body.price,
             productImage:req.file.path
         }
     );
     newProduct.save().then(result=>{
         console.log(result);
     })
     .catch(err=>{
         next(err);
     })
     res.status(201).json({
         message: 'created product successfully',
         createdProduct: {
             name:newProduct.name,
             price:newProduct.price,
             _id:newProduct._id,
             productImage:req.file.path,
             request:{
                 type:"GET",
                 url:'http://localhost:3000/products/' +newProduct._id
             }
         }
     })
 }

 exports.get_product_byId=(req, res, next) => {
    Model.Product.findById(req.params.productId)//productId response to the ':productId of URI"
    .select('_id name price productImage')
    .exec()
    .then(product=>{
        if(product){
            res.status(200).json({
                _id:product._id,
                name:product.name,
                price:product.price,
                request:{
                    type:"GET",
                    url:'http://localhost:3000/products/' +product._id
                }
            });
        }else{
            res.status(404).json({message:"no volid entry"})
        }
        
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err})
    })
    //res.status --promise is asyn, so it will not wait then and catch 
}


exports.update_product_byId=(req, res, next) => {
    const id=req.params.productId
    /*
    content/type:application/json
    authorization:Bearer+token
    verify:[
        {
        "propName":"name",
        "value":"newone"
    }
]
     */
    const updateObj={};
    for(const ops of req.body){
        updateObj[ops.propName]=ops.value;
    }
  Model.Product.update({_id:id},{$set:updateObj})
  .exec()
  .then(result=>{
     
    res.status(200).json({
        message:'Product updated',
        request:{
            type:"GET",
            url:'http://localhost:3000/products/' +id
        }
    })
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
        error:err
    })
})
}

exports.delete_product_byId=(req, res, next) => {
    const id=req.params.productId
    Model.Product.remove({_id:id})//can use findByIdAndRemove method
    .exec()
    .then(result=>{
            res.status(200).json({
                messsage:"deleted successfully",
                request:{
                    type:"POST",
                    url:'http://localhost:3000/products/',
                    body:{name:"String",price:"Number"}
                }
            })
        
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
   
}