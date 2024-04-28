import mongoose from "mongoose";

const collection = 'carts';
  
const cartSchema = new mongoose.Schema({
 products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},  
        quantity: { type: Number, required: true, default: 1 } 
        }]
});

const cartModel = new mongoose.model(collection, cartSchema);

export default cartModel;
