import express from 'express';
// importo un controller
import {getCartController, getIdCartController, postCartController, postCartIdProductIdController, putCartController, putCartidProductIdController, deleteCartIdProductIdController, deleteCartController, postCartIdPurchaseController  } from '../controllers/cart.Controller.js';

const router = express.Router();

// get
router.get('/', getCartController);

router.get('/:cid', getIdCartController);


// post
router.post('/', postCartController);
router.post('/:cid/product/:pid', postCartIdProductIdController);

router.post('/:cid/purchase', postCartIdPurchaseController);

// put
router.put('/:cid', putCartController);
router.put('/:cid/product/:pid', putCartidProductIdController);
// delete
router.delete('/:cid/product/:pid', deleteCartIdProductIdController);
router.delete('/:cid', deleteCartController);

export default router;