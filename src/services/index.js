import { getGmailTransporter } from '../config/mail.config.js'
import MailService from './mail.services.js'

const gmailTransporter = getGmailTransporter()

export const mailService = new MailService(gmailTransporter)
