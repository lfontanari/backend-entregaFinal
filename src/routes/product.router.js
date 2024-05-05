import express from 'express';
import { authToken } from '../utils.js';
import { uploaders } from '../middlewares/multer.middleware.js'
// importo un controller
import { getProductsControllers, getIdProductsControllers,  postProductsControllers, putProductsControllers, deleteProductsControllers } 
    from '../controllers/products.Controller.js'
    

const router = express.Router();

// get
router.get('/', getProductsControllers);

router.get('/:pid', getIdProductsControllers);

// post
router.post('/', uploaders.array('products'),authToken, postProductsControllers);

// put
router.put('/:pid', putProductsControllers);

// delete
router.delete('/:pid', deleteProductsControllers);

export default router;