import dotenv from 'dotenv';
import program from '../process.js';

console.log("Mode Option: ", program.opts().mode);
console.log("Test Mode on?: ", program.opts().test);
let environment = program.opts().mode;
console.log("Environment: ", environment);


if (program.opts().test) { 
    dotenv.config({path: "./src/config/.env.test" });
    environment = "test";
} else if (environment === "production") {
    dotenv.config({path:"./src/config/.env.production"});
} else if (environment === "development") {
    dotenv.config({path:"./src/config/.env.development"});
}


export default {
    port: process.env.PORT || 8080,
    urlMongo: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    gmailAccount: process.env.GMAIL_ACCOUNT,
    gmailAppPassword: process.env.GMAIL_APP_PASSWD,
    twilioAccountSID: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioSmsNumber: process.env.TWILIO_SMS_NUMBER,
    twilioToSmsNumber: process.env.TWILIO_TO_SMS_NUMBER,
    multerDest: process.env.MULTER_DEST,
    multerMaxFileSizeMB: process.env.MULTER_MAX_FILE_SIZE_MB,
    nodeEnv: process.env.NODE_ENV || 'production',
    runTests: program.opts().test
}