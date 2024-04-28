import mongoose from "mongoose";

const collection = 'tickets';

const schema = new mongoose.Schema({
   
    code: {
        type: String,
        unique: true,
        required: true
    },
    purchase_datetime: Date,
    amount: Number,
    purchaser: String
    
});

const ticketModel = new mongoose.model(collection, schema);

export default ticketModel;