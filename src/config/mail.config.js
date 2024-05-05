import nodemailer from 'nodemailer'
import {
  GMAIL_MAIL_SERVICE,
  GMAIL_APP_PASSWD,
  GMAIL_MAIL_PORT,
  GMAIL_ACCOUNT,
} from '../constants/envVars.js'

const TRANSPORTERS = {
  gmail: {
    service: GMAIL_MAIL_SERVICE,
    port: GMAIL_MAIL_PORT,
    // secure: false,
    auth: {
      user: GMAIL_ACCOUNT,
      pass: GMAIL_APP_PASSWD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
}

const createTransporter = (transporter) => nodemailer.createTransport(transporter)

export const getGmailTransporter = () => createTransporter(TRANSPORTERS.gmail)
