import { Router } from "express";
import messageDao from "../daos/dbManager/message.dao.js";


const router = Router();

// Endpoints 

router.get("/", async (req, res) => {
  try {
     
    const messages = await messageDao.getAllMessages();

    res.json({
        data: messages,
        message: "Messages list",
    });
    
  } catch (error) {
    res.status(500).json({ error: `Ocurrió un error : ${error.message}` });
  }
        
});



router.post("/", async (req, res) => {

try {
    console.log(req.body);
    const message = await messageDao.createMessage(req.body);
  
    res.json({
        message,
        message: "Mensaje creado",
    });
 

  } catch (error) {
    res.status(500).json({ error: `Ocurrió un error : ${error.message}` });
  }
});


export default router;