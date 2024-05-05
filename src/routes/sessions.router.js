import { Router } from 'express';
import userController  from '../controllers/user.controller.js';
import UserServiceDao  from '../services/db/dao/user.dao.js';
import passport from 'passport';
import { isValidPassword, generateJWToken, authorization } from '../utils.js';

const userServiceDao = new UserServiceDao();

const router = Router();

router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });

router.get("/githubcallback", passport.authenticate('github', { session: false, failureRedirect: '/github/error' }), async (req, res) => {
    const user = req.user;

    // conJWT 
    const tokenUser = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.role
    };
    const access_token = generateJWToken(tokenUser);
    console.log(access_token);

    const userUpdatedLastConnection = await userServiceDao.updateLastConnectionForUser(
        req.user.id
      )
      
    res.cookie('jwtCookieToken', access_token,
        {
            maxAge: 60000,
            httpOnly: true //No se expone la cookie
            // httpOnly: false //Si se expone la cookie

        }

    )
    res.redirect("/users");

});

// Register
router.post("/register", passport.authenticate('register', { session: false }), async (req, res) => {
    console.log("Registrando usuario:");
    res.status(201).send({ status: "success", message: "Usuario creado con exito." });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // const user = await userDao.findOne({ email: email });
        const user = await userController.findByUsername(email);
        console.log("Usuario encontrado para login:");
        console.log(user);
        if (!user) {
            console.warn("User doesn't exists with username: " + email);
            return res.status(204).send({ error: "Not found", message: "Usuario no encontrado con username: " + email });
        }
        if (!isValidPassword(user, password)) {
            console.warn("Invalid credentials for user: " + email);
            return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
        }

        //   const date = await usersService.updateConnection(user._id, new Date());
        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        };
        const access_token = generateJWToken(tokenUser);

         // Adjuntar el usuario al objeto req
         req.user = user;
         console.log("user: ");
         console.log(req.user);
         console.log(req.user.id);
         const userUpdatedLastConnection = await userServiceDao.updateLastConnectionForUser(
            req.user.id
          )
        //1ro con LocalStorage
        // res.send({ message: "Login successful!", jwt: access_token });
        // 2do con Cookies
        res.cookie('jwtCookieToken', access_token,
            { maxAge: 60000,
                // httpOnly: true //No se expone la cookie
                // httpOnly: false //Si se expone la cookie
            }
        )
        // res.send({ message: "Login successful!", user: user});
        res.send({ message: "Login successful!", access_token: access_token, id: user._id });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", error: "Error interno de la applicacion." });
    }

});

// vamos hacer un logout
router.get('/logout', async (req,res) => {

    req.session.destroy (error => {
        if (error){
            res.json({error: 'Error logout', msg: "Error al cerrar la session"})
        }
    })
 
       
    res.send('Session cerrada correctamente!');
});

router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  });
  
router.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Fallo el proceso de registración!"});
});

router.get("/fail-login", (req, res) => {
    res.status(401).send({ error: "Fallo el proceso de login!"});
})


export default router;