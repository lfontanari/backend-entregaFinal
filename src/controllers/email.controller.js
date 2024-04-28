import nodemailer from 'nodemailer';
import config from '../config/config.js';
import __dirname from '../utils.js';
import { createHash , isValidPassword} from '../utils.js'
import { v4 } from 'uuid'
import { updateByFilter, findByUsername } from './user.controller.js';

// configuracion de transport: servicio, puerto y credenciales
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword
    }
})

// Verificamos conexion con gmail
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
})

const mailOptions = {
    from: "Curso Backend Test - " + config.gmailAccount,
    to: 'lorena_fontanari@yahoo.com.ar',
    subject: "Correo de prueba curso Backend CoderHouse ",
    html: `<div><h1> Esto es un test de correo con NodeMailer </h1></div>`,
    attachments: []
}


const mailOptionsWithAttachments = {
    from: "Curso Backend Test  - " + config.gmailAccount,
    to: `${config.gmailAccount};lorena_fontanari@yahoo.com.ar`,
    subject: "Correo de prueba curso Backend CoderHouse ",
    html: `<div>
                <h1>Esto es un Test de envio de correos con Nodemailer!</h1>
                <p>Ahora usando imagenes: </p>
                <img src="cid:meme"/>
            </div>`,
    attachments: [
        {
            filename: 'Meme de programacion',
            path: __dirname + '/public/images/meme.png',
            cid: 'meme'
        }
    ]
}


export const sendEmail = (req, res) => {
    try {
        let result = transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ message: "Error", payload: error });
            }
            console.log('Message sent: %s', info.messageId);
            res.send({ message: "Success", payload: info })
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
}


export const sendEmailWithAttachments = (req, res) => {
    try {
        let result = transporter.sendMail(mailOptionsWithAttachments, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ message: "Error", payload: error });
            }
            console.log('Message sent: %s', info.messageId);
            res.send({ message: "Success", payload: info })
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
}


/*=============================================
=                   Password Reset            =
=============================================*/

const mailOptionsToReset = {
    from: config.gmailAccount,
    // to: config.gmailAccount,
    subject: "Reset password",
}
 
const tempDbMails = {}

export const sendEmailToResetPassword = (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).send('Email not privided')
        }
        // Generamos un token/idrandom
        const token = v4();
        //const link = `http://localhost:${config.port}/api/email/reset-password/${token}`
        const link = `http://localhost:${config.port}/api/email/reset-password-form/${token}`
        // Store the email and its expiration time
        //  60 * 60 * 1000: Esto representa una hora en milisegundos. Multiplicando 60 (segundos) por 60 (minutos) y luego por 1000 (milisegundos), obtenemos el equivalente a una hora en milisegundos.
        tempDbMails[token] = {
            email,
            expirationTime: new Date(Date.now() + 1 * 60 * 1000)
        }
        console.log(tempDbMails);


        mailOptionsToReset.to = email
        mailOptionsToReset.html = `To reset your password, click on the following link: <a href="${link}"> Reset Password</a>`

        transporter.sendMail(mailOptionsToReset, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send({ message: "Error", payload: error });
            }
            console.log('Message sent: %s', info.messageId);
            res.send({ message: "Success", payload: info })
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
}



export const resetPassword = async (req, res) => {
 try {
    const token = req.params.token;
    const email = tempDbMails[token];
   
    const now = new Date();
    console.log(now);
    // el caracter ? hace que no rompa si email viene undefined
    const expirationTime = email?.expirationTime
    console.log(expirationTime);

    if (now > expirationTime || !expirationTime) {
        delete tempDbMails[token]
        console.log('Expiration time completed');
        return res.redirect('/api/email/send-email-to-reset')
    }

     
    // Hacemos toda la logica de Update de Password contra la DB
      // busco la password actual para comparar que la nueva sea diferente
    let { newPassword } = req.body;
    
    if (!newPassword) {
          console.log('La nueva contraseña no ha sido proporcionada');
          return res.status(400).send('La nueva contraseña no ha sido proporcionada.');
    }

    
    const user = await findByUsername(email?.email);
    

    if (!user) {  
        console.log('Usuario no encontrado');
        return res.status(404).send('Usuario no encontrado.');}
  
    
    if (isValidPassword(user, newPassword)) {
   
        console.log('La nueva contraseña debe ser diferente a la anterior');
        return res.status(400).send('La nueva contraseña debe ser diferente a la anterior.');
    }
    newPassword = createHash(newPassword);
    const filter = {email: email?.email} ;  
    const value = {password: newPassword};  
    const result = await updateByFilter(filter, value);
    

    delete tempDbMails[token]; // Elimina el token de la lista temporal después de usarlo

    console.log('Contraseña cambiada exitosamente');
    return res.status(200).send('Contraseña cambiada exitosamente.');
    
} catch (error) {
    console.error(error);
    res.status(500).send({ error: error, message: "No se pudo resetear la password:"});
}

}

export const resetPasswordForm = async (req, res) => {
    try {
         
       const token = req.params.token;
      
       if (!tempDbMails[token]){
        console.log('El Token es invalido, solicite nuevo token');
        return res.status(201).send('El Token es invalido, solicite nuevo token.');}
       

       const email = tempDbMails[token].email;
       
        // Renderiza el formulario HTML para restablecer la contraseña
        res.render('resetPassword', { token });
        
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo resetear la password:"});
    }
}