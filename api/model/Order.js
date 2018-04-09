const mongoose = require('mongoose')// refer mongoose module

const orderSchema = new mongoose.Schema({  //define order schema
    _id: mongoose.Schema.Types.ObjectId,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required:true
    },
    quantity: { type:Number, default: 1 }

},
    {
        timestamps: true
    })

//create order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;