import { Router } from 'express';
import passport from 'passport';
import { authToken } from '../utils.js';

import { passportCall, authorization } from "../utils.js";
import { getProductsControllers }  from '../controllers/products.Controller.js';

const router = Router();


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
    authorization('user'),   // --> Autorizo a ver el perfil del usuario si tiene role=user
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