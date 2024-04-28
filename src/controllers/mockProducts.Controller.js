import { createProductMock} from '../services/db/dao/product.dao.js';

export const getMockProductsController = async (req, res) => {
    try{
        console.log("en products.Controller: " );
        let products = [];
        for (let i = 0; i < 100; i++) {
            products.push(createProductMock());
        }
         
        res.send({ 
            status: "success",
            payload: products
        });
         
        
    }
    catch(err){
        res.status(500).send({error:err, message: "No se pudo obtener los productos."})
    }
  };