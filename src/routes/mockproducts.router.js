import { Router } from "express";
import { getMockProductsController } from "../controllers/mockProducts.Controller.js";


const router = Router();

router.get("/", getMockProductsController);

export default router;