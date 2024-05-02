// # Mongo credentials
export const MONGO_USER = process.env.MONGO_USER
export const MONGO_PASS = process.env.MONGO_PASS
export const MONGO_HOST = process.env.MONGO_HOST
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME

// # App credentials
export const NODE_ENV = process.env.NODE_ENV || 'production'
export const PERSISTENCE_TYPE = process.env.PERSISTENCE_TYPE
export const SECRET_SESSION = process.env.SECRET_SESSION || 'secret'
export const SECRET_JWT = process.env.SECRET_JWT || 'jwtSecret'

// # Admin credentials
export const ADMIN_USER = process.env.ADMIN_USER
export const ADMIN_PASS = process.env.ADMIN_PASS

// # Server credentials
export const PORT = process.env.SERVER_PORT || 8080
export const HOST = process.env.SERVER_HOST || 'localhost'
export const BASE_URL = process.env.BASE_URL || `${HOST}:${PORT}`

// Github credentials
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
export const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL

// Mail credentials
export const GMAIL_MAIL_USER = process.env.GMAIL_MAIL_USER || 'user'
export const GMAIL_MAIL_PASS = process.env.GMAIL_MAIL_PASS || 'pass'
export const GMAIL_MAIL_SERVICE = process.env.GMAIL_MAIL_SERVICE || 'gmail'
export const GMAIL_MAIL_PORT = process.env.GMAIL_MAIL_PORT || 587
export const GMAIL_MAIL_SECURE = process.env.GMAIL_MAIL_SECURE || false
export const GMAIL_MAIL_FROM = process.env.GMAIL_MAIL_FROM || 'TEST <test@test.com>'

// Multer
export const MULTER_MAX_FILE_SIZE_MB = process.env.MULTER_MAX_FILE_SIZE_MB || 10
export const MULTER_DEST = process.env.MULTER_DEST || 'uploads'
