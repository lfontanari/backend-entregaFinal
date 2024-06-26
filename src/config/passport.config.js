import passport from 'passport';
import passportLocal from 'passport-local';
import userModel from '../services/db/models/user.model.js';
import GitHubStrategy from 'passport-github2';
import jwtStrategy from 'passport-jwt';
import { PRIVATE_KEY } from '../utils.js';
import { createHash, isValidPassword } from '../utils.js';
import {
    
    GITHUB_CALLBACK_URL,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    
  } from '../constants/envVars.js';

import cartModel from "../services/db/models/cart.model.js";
const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

//  Declaramos estrategia

const localStrategy = passportLocal.Strategy;

// Estrategia de obtener Token JWT por medio de Cookie:
const initializePassport = () => {

    // Usando JWT
    passport.use('jwt', new JwtStrategy(
        { 
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY

        }, async (jwt_payload,done) => {
        
            console.log("entrando a passport strategy con JWT...");
        try {
            console.log("jwt obtenido del payload...");
            console.log(jwt_payload);
            return done (null, jwt_payload.user)   

        } catch (err) {
            return done (err);
        }
        }
   
    ));
    /*=============================================
    =                GitHubStrategy               =
    =============================================*/
    //Estrategia de Login con GitHub:
     // Usando GitHub
     passport.use('github', new GitHubStrategy(
        {
            clientID: GITHUB_CLIENT_ID, 
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackUrl: GITHUB_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {

            try {
                //Validamos si el user existe en la DB
                // console.log(profile);
                const user = await userModel.findOne({ email: profile._json.email });
                // console.log("Usuario encontrado para login:");
                // console.log(user);
                if (!user) {
                    // console.warn("User doesn't exists with username: " + profile._json.email);
                    const newCart = await cartModel.create({})

                    let newUser = {
                        first_name: profile._json.name,
                        last_name: '',
                        age: 28,
                        email: profile._json.email,
                        password: '',
                        loggedBy: "GitHub",
                        cart: newCart
                    }
                    const result = await userModel.create(newUser);
                    return done(null, result)
                } else {
                    // Si entramos por aca significa que el user ya existe en la DB
                    return done(null, user)
                 }
            
            } catch (error) {
                return done(error)
            }
        }
    ));


    passport.use('register', new localStrategy(
        // passReqToCallback: para convertirlo en un callback de request, para asi poder iteracturar con la data que viene del cliente
        // usernameField: renombramos el username
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                //Validamos si el user existe en la DB
                const exist = await userModel.findOne({ email });
                if (exist) {
                    console.log("El user ya existe en la BD!!");
                    done(null, false)
                }

                const newCart = await cartModel.create({})
                    
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    loggedBy: 'form',
                    cart: newCart
                }
                const result = await userModel.create(user);
                console.log(result);
                // Todo sale ok
                return done(null, result)
            } catch (error) {
                return done(error)
            }
        }
    ));






    //Funciones de Serializacion y Desserializacion
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
           
            done(null, user)
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }
    })

    // estas funciones permiten a Passport.js manejar la información del usuario durante el proceso de autenticación, serializando y deserializando los usuarios para almacenar y recuperar información de la sesión. Estas funciones son esenciales cuando se implementa la autenticación de usuarios en una aplicación Node.js utilizando Passport.js.
}


const cookieExtractor = req => {
    let token = null;
    console.log("entrando a cookie extractor");
    
    if (req && req.cookies) { // validamos q exista el request y la cookie
        
        token = req.cookies['jwtCookieToken'];
        console.log("Token obtenido desde Cookie:");
        console.log(token);
    }
     return token;
};

export default initializePassport;
