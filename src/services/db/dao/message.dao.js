import { messageModel } from "./models/message.model.js";
 

class MessageDao {
    constructor() {
        this.model = messageModel;
    }

    async getAllMessages() {
        return await messageModel.find();
    }


    async createMessage(message) {
        return await messageModel.create(message);
    }
}
export default new MessageDao();