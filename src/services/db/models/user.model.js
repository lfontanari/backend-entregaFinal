import mongoose from "mongoose";
import Carts from './cart.model.js'
const collectionName = 'users';

const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,
    required: true
};

const stringTypeSchemaNonUniqueRequired = {
    type: String,
    required: true
};

const userSchema = new mongoose.Schema({
    first_name: stringTypeSchemaNonUniqueRequired,
    last_name: {
      type: String,
      required: false,
    },
    email: stringTypeSchemaUniqueRequired,
    age: Number,
    password: {
      type: String,
      required: false,
    },
    cart: {      
      type: mongoose.Schema.Types.ObjectId,
      ref: Carts,
      default: null,
    },
    loggedBy: String,
    role: {
        type: String,
        default: 'USER',
        enum: ['USER', 'ADMIN', 'PREMIUM'],
    },
    lastConnection: {
        type: Date,
        default: null,
    },
    documents: {
        type: [
          {
            name: {
              type: String,
              required: true,
            },
            reference: {
              type: String,
              required: true,
            },
          },
        ],
        default: [],
    }
    
});

const userModel = new mongoose.model(collectionName, userSchema);

export default userModel;