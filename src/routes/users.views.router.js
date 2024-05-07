import { Router } from 'express';
import passport from 'passport';
import { authToken } from '../utils.js';

import { passportCall, authorization } from "../utils.js";
import { getProductsControllers }  from '../controllers/products.Controller.js';
import { getIdCartController  } from '../controllers/cart.Controller.js';

const router = Router();

// Manejo de la ruta '/products'
router.get('/products', async (req, res) => {
    console.log("antes de hacer getProcutscontrollers");
    const userData = req.user;
    const productos = await getProductsControllers(req, res);
    console.log("va a renderizar products_______________");
    console.log(productos);
    console.log(userData);
    // Renderiza la plantilla de Handlebars para la página de productos
    res.render('products', { productos, userData });

});

router.get('/myCart', async (req, res) => {
    const { user } = req;
    console.log(user);
    const mycart = await getIdCartController(user.cart, { lean: true })
  
    const totalAmount = mycart.products.reduce((acc, product) => {
      return acc + product._id.price * product.quantity
    }, 0)
  
    res.render('myCart', {
      user,
      mycart,
      totalAmount,
      css: ['myCart'],
      js: ['myCart'],
      title: 'Mi carrito',
    })
  });

router.get("/login", (req, res) => {
    res.render('login')
})

router.get("/register", (req, res) => {
    res.render('register')
})

router.get("/", 
    // authToken, // --> usando Authorization Bearer Token
    // passport.authenticate('jwt', {session: false}), // --> Usando JWT por Cookie
    passportCall('jwt'),
    authorization('USER'),   // --> Autorizo a ver el perfil del usuario si tiene role=USER
    (req, res) => {
      res.render('profile', {
        user: req.user
    })
});
/* antes
router.get("/", 
    // authToken, // --> usando Authorization Bearer Token
    // passport.authenticate('jwt', {session: false}), // --> Usando JWT por Cookie
    passportCall('jwt'),
    authorization('user'),   // --> Autorizo a ver el perfil del usuario si tiene role=user
    async (req, res) => {

        try{  
            const productos = await getProductsControllers(req, res);
            
            console.log("en users.view.router.js, veo productos");
            console.log(productos);
            
            res.render('products', { productos: productos, user: req.user });

        }  catch (error) {
            console.error(error);
            res.render("error");
        }
    
});
*/



router.get("/error", (req, res) => {
    res.render("error");
});

export default router;