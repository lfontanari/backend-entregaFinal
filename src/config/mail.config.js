import nodemailer from 'nodemailer'
import {
  GMAIL_MAIL_SERVICE,
  GMAIL_MAIL_PASS,
  GMAIL_MAIL_PORT,
  GMAIL_MAIL_USER,
} from '../constants/envVars.js'

const TRANSPORTERS = {
  gmail: {
    service: GMAIL_MAIL_SERVICE,
    port: GMAIL_MAIL_PORT,
    // secure: false,
    auth: {
      user: GMAIL_MAIL_USER,
      pass: GMAIL_MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
}

const createTransporter = (transporter) => nodemailer.createTransport(transporter)

export const getGmailTransporter = () => createTransporter(TRANSPORTERS.gmail)
