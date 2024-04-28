import { Router } from "express";
// utilizamos a nivel endpoint el cookie parser, sino puede ser a nivel aplicacion y debiera ir en app.js
import cookieParser from 'cookie-parser';


const router = new Router();

// con firma
router.use(cookieParser('Coder53crf3tC0d3'));

router.get('/index', (req, res) => {
    res.render('index', {});
});

// con firma el seteo de la cookie cambia 
router.get('/setcookie', (req, res) => {
  // sin firma
  res.cookie('CooderCookie', 'Esta es una cookie CON firma!!', 
  {
      maxAge: 30000,
      signed: true
  }).send('cookie asignada con exito');
});

// para obtener cookie con firma
router.get('/getcookie', (req, res) => {
    // con firma
    res.send(req.signedCookies); // si estaria firmada debo usar signedcookie
});


// para ELIMINAR cookie con firma o sin firma es lo mismo
router.get('/deletecookie', (req, res) => {
    // sin firma
    res.clearCookie('CooderCookie').send("Cookie borrada");
});

// cuando la cookie es alterada y la quiero obtener, si fue firmada no la puedo obtener
/* -------------------------------- SESSION */
router.get('/session', (req, res) => {
    // contamos cuantas veces ha ingresado
    if (req.session.counter) {
        req.session.counter++;
        res.send(`Usted ha visitado este sitio ${req.session.counter} veces`);
    } else {
        //creo la sesion
        req.session.counter= 1;
        res.send('Bienvenido !!');

    }
});

// vamos hacer un logout
router.get('/logout', (req,res) => {

    req.session.destroy (error => {
        if (error){
            res.json({error: 'Error logout', msg: "Error al cerrar la session"})
        }
    })

    res.send('Session cerrada correctamente!');
});

// login
router.get('/login', (req,res) => {

    // enviar por query param informacion del username y pass

    const { username, password } = req.query;
   
    console.log(username); console.log(password);
    if (username !== 'pepe' || password !== '123pepe') {
        return res.status (401).send('Usuario o password invalidas');
    } else {
        // creo la propiedad user para guardar el username logueado
        //session es un objeto entonces java me permite crearle propiedades, user y admin son propiedades que yo estoy generando ahora.
        req.session.user = username;
        req.session.admin = true;
        res.send('Login exitoso!!!')
    }
});

// Middleare auth
function auth (req, res, next) {
    if (req.session.user  && req.session.admin ) {
        return next();
    } else {
        console.log(req.session.user);
        return  res.status(401).send('No estas autorizado a este recurso!')
    }
}


// si se logea pepe lo mando a una ruta protegida
// uso un middleware para chequear si esta autorizado
router.get('/private', auth, (req,res) => {
    res.send('Si estas viendo esto es porque estas autorizado a este recurso!')

});

export default router;