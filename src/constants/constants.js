import { __root } from '../utils.js'
import { BASE_URL, MULTER_DEST } from './envVars.js'

export const PRIVACY_TYPES = {
  PUBLIC: 'PUBLIC',
  NO_AUTH: 'NO_AUTH',
  PRIVATE_VIEW: 'PRIVATE_VIEW',
  NO_AUTH_VIEW: 'NO_AUTH_VIEW',
}

export const USER_ROLES = {
    USER: 'USER',
    ADMIN: 'ADMIN',
    PREMIUM: 'PREMIUM',
  }

export const ALL_USER_ROLES = Object.values(USER_ROLES)

export const ALL_USER_ROLES_WITHOUT_ADMIN = ALL_USER_ROLES.filter(
    (role) => role !== USER_ROLES.ADMIN
  )
  
export const MULTER_PATH_FOLDER = `${__root}/${MULTER_DEST}`

export const MAILS_TEMPLATES = {
  WELCOME: ({ name }) => ({
    subject: 'Bienvenido a mi tienda',
    html: `<b>Gracias por registrarte ${name}</b>`,
  }),
  PURCHASED_CART: ({ name, ticket }) => {
    const date = new Date(ticket.purchaseDateTime)
    const stringDate = date.toLocaleString()

    return {
      subject: 'Compra realizada',
      html: `<p>Gracias por tu compra <b>${name}</b></p>
        <h2>Ticket de compra</h2>
        <p>Código de ticket: <b>${ticket.code}</b></p>
        <p>Fecha de compra: <b>${stringDate}</b></p>
        <p>Email: <b>${ticket.purchaser}</b></p>
        <p>Importe total: <b>$${ticket.amount}</b></p>
        `,
    }
  },
  DELETED_ACCOUNT: ({ name, reason }) => ({
    subject: 'Cuenta eliminada',
    html: `<p>
    <b>Hola ${name}</b>, queríamos informarte que tu <b>cuenta</b> ha sido <b>eliminada</b> por el siguiente motivo: <b>"${reason}"</b>
    </p>`,
  }),
}


// xport const INACTIVE_CONNECTION_PARAM = 1000 * 60 * 60 * 24 * 2 // 2 days
export const INACTIVE_CONNECTION_PARAM = 1000 * 60 * 60 * 0.5 // 2 days