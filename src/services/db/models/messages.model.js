import { Schema, model } from "mongoose";

  
const messageSchema = new Schema({
        user: { type: String,  required: true},  // correo del usuario
        message: { type: String, required: true } // mensaje del usuario
    
});

const messageModel = model("messages", messageSchema);

export { messageModel };