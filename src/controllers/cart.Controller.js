// importar capa servicios
 
import { getAllCarts, getCartById, createCart, getProductsFromCart, updateCartProducts} from '../services/db/dao/cart.dao.js';

import { getProductById , updateProduct } from '../services/db/dao/product.dao.js';
import { createTicket } from '../services/db/dao/ticket.dao.js';
import ticketModel from '../services/db/models/ticket.model.js';
 


export const getCartController = async (req, res) => {
    try {
        const carts = await getAllCarts();
        res.json({

            data: carts,
            message:"Carts list",
        });

    } catch (error) {
        console.log(err);
        res.status(500).json({ error: `Ocurrió un error : ${error.message}` });
    }
};

// router.get('/:cid',async (req,res)=>{
export const getIdCartController = async (req, res) => {
    try{
        let cart = await getProductsFromCart(req.params.cid);
        let products = cart.products;
        res.send(products);
    }catch(err){
        res.status(500).json({error:err});
    }
        
};

export const postCartController = async (req,res)=>{
    try{
        res.send( await createCart())
    }catch(err){
        res.status(500).json({error:err})
    }
    
};

// router.post('/:cid/product/:pid', async (req,res)=>{
export const postCartIdProductIdController = async (req,res)=>{
    try{
        const {cid,pid} = req.params
        const product = await  getProductById(pid)
        const cart = await getCartById(cid)
        if (product == null || cart == null){
            return res.status(404).json("Producto Inexistente")
        }else{
        
            if(cart.products.some((e)=>e.product._id.toString() == product._id)){
               let index =cart.products.findIndex((e)=>e.product._id.toString() == product._id);
               cart.products[index].quantity +=1;
            }
            else{   
                cart.products.push({product:product._id});
           
            }
            const addProduct = updateCartProducts(cart._id,cart);
            res.status(200).json(addProduct);
        }
      
    }catch(err){
        res.status(500).json({error:err});
        
    }
};

// permite finalizar el proceso de compra del carrito, corroborando 
// el stock del producto al momento , si hay stock se resta, caso contrario no se agrega
// el producto al proceso de compra
export const postCartIdPurchaseController = async (req, res) => {
    try{

        const {cid} = req.params;
        // obtengo el carrito
        const cart = await getCartById(cid);
        console.log (cart);
        if (!cart) {
            return res.status(404).json({ error: 'El carrito no fue encontrado.' });
          }
      
        let totalAmount = 0;
          // Verificar el stock de los productos en el carrito
          
        for (const item of cart.products) {
            const product = await  getProductById(item.product);
            if ( product && product.stock >= item.quantity) {
            // Calcular el totalAmount sumando los precios de los productos en el carrito
               totalAmount += product.price * item.quantity;
               
                product.stock -= item.quantity;
                
                await updateProduct(item.product, product);
                // Limpiar del carrito el producto que ya pudo comprar
                //console.log('carrito: ' + cart);
                //console.log('producto: ' + product);
                    
                let newProducts = cart.products.filter((e)=> e.product._id.toString() != product._id);
                console.log('newProducts: ' + newProducts);
                cart.products= newProducts;
                updateCartProducts(cart._id,cart);

               
            }
          }

          if (totalAmount > 0 ) {
            // Crear un nuevo ticket con el total calculado
            // y la información de la compra
        
            const newTicket = new ticketModel({
                code: generateTicketCode(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: "user@mail.com"
            });
            
            await createTicket(newTicket);
           
            res.status(200).json({ message: 'Compra finalizada exitosamente.', ticket: newTicket });
        }else {
            res.status(201).json({ message: 'No hay productos con stock para comprar.' });
        }
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
      res.status(500).json({ error: 'Ocurrió un error al finalizar la compra.' });
    }

};

// Función para generar un código único para el ticket
function generateTicketCode() {
    // Obtener la marca de tiempo actual en milisegundos
    const timestamp = Date.now();
  
    // Generar un identificador único aleatorio (por ejemplo, utilizando Math.random)
    const uniqueIdentifier = Math.floor(Math.random() * 10000); // Número aleatorio entre 0 y 9999
  
    // Combinar la marca de tiempo y el identificador único para formar el código del ticket
    const ticketCode = `TICKET-${timestamp}-${uniqueIdentifier}`;
  
    return ticketCode;
  }
  

//router.put('/:cid', async (req,res)=>{
export const putCartController = async (req, res)=>{
    let cart = await getCartById(req.params.cid);
    let products = req.body;
    products.forEach((e)=>{
        if(cart.products.findIndex((p)=>p.product._id.toString() == e._id) != -1){
            cart.products[cart.products.findIndex((p)=>p.product._id.toString() == e._id)]. quantity += e.quantity
        }else{
            cart.products.push({product:e._id,quantity:e.quantity});
        }
       
    })
    const addProduct = await updateProduct(cart._id,cart);
    res.status(200).json(addProduct);
};

//router.put('/:cid/product/:pid', async (req,res)=>{
export const putCartidProductIdController = async (req, res) => {
    let cart = await getCartById(req.params.cid)
    const product = await  getProductById(req.params.pid)
    if(cart.products.some((e)=>e.product._id.toString() == product._id)){
        let index =cart.products.findIndex((e)=>e.product._id.toString() == product._id);
        cart.products[index].quantity = req.body.quantity;
        const addProduct = updateCartProducts(cart._id,cart);
        res.status(200).json(addProduct);
     }
    
};

// router.delete('/:cid/product/:pid', async (req,res)=>{
export const deleteCartIdProductIdController = async (req, res) => {
    try{
        let cart = await getCartById(req.params.cid);
       
        let newProducts = cart.products.filter((e)=> e.product._id.toString() != req.params.pid)
        console.log(newProducts);
        cart.products= newProducts;
        let updatedCart = updateCartProducts(req.params.cid,cart);
        res.status(201).json(updatedCart);
    }
    catch(err){ res.status(500).json({error:err})};
    
};


//router.delete('/:cid', async (req,res)=>{
export const deleteCartController = async (req, res)=>{
    try{
        let deleted = await getCartById(req.params.cid);
        deleted.products = [];
        updateCartProducts(req.params.cid,deleted);
        res.status(201).json(deleted.message);
    }
    catch(err){ res.status(500).json({error:err})}
    
};
