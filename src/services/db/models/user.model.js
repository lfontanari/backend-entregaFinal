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
    first_name: String,
    last_name: String,
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