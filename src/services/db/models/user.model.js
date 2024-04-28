import mongoose from "mongoose";

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
    last_name: stringTypeSchemaNonUniqueRequired,
    email: stringTypeSchemaUniqueRequired,
    age: Number,
    password: stringTypeSchemaNonUniqueRequired,
    cart: {      
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    loggedBy: String,
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'premium'],
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