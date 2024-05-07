import httpStatus from 'http-status'
import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/errors-enum.js';
import { MULTER_DEST } from '../constants/envVars.js'
import { generateProductErrorInfo } from '../services/errors/messages/product-creation-error.message.js';

// importar capa servicios
import { getAllProducts, getProductById, updateProduct, deleteProduct, createProduct} from '../services/db/dao/product.dao.js';

export const getProductsControllers = async (req, res) => {
  try{
     
      const { limit,page,query,sort } = req.query
      const productos = await getAllProducts(limit, page, query, sort);
      console.log("en products.Controller: " );
      console.log(productos);
      // Verificar si la solicitud proviene de Postman
      const isPostmanRequest = req.headers['user-agent'] === 'PostmanRuntime/7.37.3'; 

    // Si la solicitud proviene de Postman, responder con res.json()
    if (isPostmanRequest) {
      res.json({
        productos,
        message: "Product list",
      })
      } else {
        // Si no proviene de Postman, devolver los productos
        return productos;
      }
  }
  catch(err){
      res.status(500).json({error:err})
  }
};


export const getIdProductsControllers = async (req,res)=>{
  try{
      
      const{ pid } = req.params
      if (!pid) return res.status(400).send({ error: `Must to especify an id` })
      const producto = await getProductById(pid)
      if (!producto) return res.sendNotFound({ error: `Product with id "${id}" not found` })

      res.status(200).json(producto)

  }
  catch(err){
      res.status(500).json({error:err})
  }
};

export const postProductsControllers = async (req,res,next)=>{
  try{
     
      const { user, files } = req;
      const images = files?.map((file) => ({
        name: file.filename,
        reference: extractToRelativePath(file.path, MULTER_DEST),
      }));
      const {
        title,
        description,
        code,
        price,
        status = true,
        stock,
        category,
        thumbnail,
      } = req.body;
      

      if (req.user.role !== "PREMIUM" && req.user.role !== "ADMIN"){
         // creamos un custom error 
         CustomError.createError({
          name: "Product Create Error",
          cause: generateProductErrorInfo({producto}),
          message: "Rol de usuario sin permisos para crear un producto.",
          code: EErrors.INVALID_PERMISSIONS_ERROR
        });
      }
      
      if (!title || !description || !code || !stock || !category || !price) {
        // creamos un custom error 
        CustomError.createError({
          name: "Product Create Error",
          cause: generateProductErrorInfo({ title, description, code, stock, category, price }),
          message: "Error tratando de crear un producto.",
          code: EErrors.INVALID_TYPES_ERROR
        });
      }
      
      const owner = user.email;
      
      const product = await createProduct({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
        owner,
        images,
      })
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

