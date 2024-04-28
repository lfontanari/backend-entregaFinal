import { Router } from "express";
import { sendEmail, sendEmailWithAttachments, sendEmailToResetPassword, resetPassword, resetPasswordForm } from '../controllers/email.controller.js';

const router = Router();

router.get("/", sendEmail);
router.get("/attachments", sendEmailWithAttachments);

router.post('/send-email-to-reset', sendEmailToResetPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/reset-password-form/:token', resetPasswordForm);

export default router;