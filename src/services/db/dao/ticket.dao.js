
import  ticketModel  from "../models/ticket.model.js";
 

export const createTicket = async (ticket)=> {
        return await ticketModel.create(ticket);
    }
    
