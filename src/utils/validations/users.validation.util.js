import { ALL_USER_ROLES } from '../../constants/constants.js'


const isValidRole = (role, arrayRoles = ALL_USER_ROLES) => {
  return arrayRoles.includes(role)
}

export { isValidRole }