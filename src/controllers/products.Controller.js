import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/errors-enum.js';
import { generateProductErrorInfo } from '../services/errors/messages/product-creation-error.message.js';

// importar capa servicios
import { getAllProducts, getProductById, updateProduct, deleteProduct, createProduct} from '../services/db/dao/product.dao.js';

export const getProductsControllers = async (req, res) => {
  try{
     
      const { limit,page,query,sort } = req.query
      const productos = await getAllProducts(limit, page, query, sort);
      console.log("en products.Controller: " );
      console.log(productos);
      
      // return productos;
       
      res.json({
        productos,
        message: "Product list",
      });
       
      
  }
  catch(err){
      res.status(500).json({error:err})
  }
};


export const getIdProductsControllers = async (req,res)=>{
  try{
      
      const{ pid } = req.params
      const producto = await getProductById(pid)
      res.json(producto)

  }
  catch(err){
      res.status(500).json({error:err})
  }
};

export const postProductsControllers = async (req,res)=>{
  try{
      let producto = req.body;
      console.log("voy a crear el producto");
      console.log(req.user.role);
      if (req.user.role !== "premium" && req.user.role !== "admin"){
         // creamos un custom error 
         CustomError.createError({
          name: "Product Create Error",
          cause: generateProductErrorInfo({producto}),
          message: "Rol de usuario sin permisos para crear un producto.",
          code: EErrors.INVALID_PERMISSIONS_ERROR
        });
      }

      if (!producto.title || !producto.price) {
        // creamos un custom error 
        CustomError.createError({
          name: "Product Create Error",
          cause: generateProductErrorInfo({producto}),
          message: "Error tratando de crear un producto.",
          code: EErrors.INVALID_TYPES_ERROR
        });
      }
      
      if (user?.role ==="premium") {
        producto.owner=user.email;
      }

      const newProduct = await createProduct(producto)
      res.status(201).send({message: "Producto agregado correctamente"})
  }
  catch(err){
      console.error(err.cause);
      res.status(500).send({error:err.code, message: err.message});
  }

};

export const putProductsControllers = async (req,res)=>{
  try{
      let productoModificado = req.body
      let modified = await updateProduct(req.params.pid,productoModificado)
      res.status(201).json(modified)
  }
  catch(err){
      res.status(500).json({error:err})
  }    
};

export const deleteProductsControllers = async (req,res)=>{
  try{
      let deleted =await deleteProduct(req.params.pid)
      res.status(201).json(deleted.message)
  }
  catch(err){ res.status(500).json({error:err})}
  
};

