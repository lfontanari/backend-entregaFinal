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