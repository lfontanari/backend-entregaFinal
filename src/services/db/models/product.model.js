import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const collection = 'products';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true},
  description: { type: String, required: true},
  price: { type: Number, required: true},
  thumbnail: { type: String, required: true},
  code: {type: String,  unique: true, required: true},
  stock: { type: Number, required: true},
  category:{type: String, required: true},
  status:{type: Boolean, default:true},
  owner: { type: String, required: false, default:"admin"}
});

productSchema.plugin(mongoosePaginate);

const productModel = new mongoose.model(collection, productSchema);

export default productModel;