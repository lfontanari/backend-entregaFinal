// importar capa servicios
import  UserServiceDao  from '../services/db/dao/user.dao.js';
import config  from '../config/config.js';
import { castToMongoId } from '../utils/casts.utils.js'
import { isValidRole } from '../utils/validations/users.validation.util.js'
import {ALL_USER_ROLES_WITHOUT_ADMIN, USER_ROLES} from '../constants/constants.js'
import EErrors from '../services/errors/errors-enum.js'
import ErrorService from '../services/errors/CustomError.js'
import CurrentUserDTO from '../services/db/dto/CurrentUserDTO.js';
import { mailService } from '../services/index.js'

const userServiceDao = new UserServiceDao();

const getAll = async (req,res) => {
    try {
        let users = await userServiceDao.getAll();
        const usersDTO = users.map((user) => new CurrentUserDTO(user));
        res.send(usersDTO);

    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({error: error, message: "No se pudo obtener los usuarios"});
    }
};

const createUser = async (req, res) => {
    try {
        let user = await userServiceDao.save(req.body);
        res.status(201).send(user);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({error: error, message: "No se pudo crear el usuario"});
    }
};

const getById = async (req, res) => {

    try {
        const{ uid } = req.params
        const user = await userServiceDao.getBy(uid);
        res.status(201).send(user);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({error: error, message: "No se pudo obtener el usuario"});
    }
    
};

const findByUsername = async (username) => {
    try {    
        const user = await userServiceDao.findByUsername(username);
        return(user);
    } catch (error) {
        console.error(error);
        throw error;
    }

};

const updateUser = async (req, res) => {
    try {
        const{ uid } = req.params 
        const userUpd = await userServiceDao.updateUser(uid, req.body);
        res.status(201).send(userUpd);
      } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({error: error, message: "No se pudo obtener el usuario con ese uid "});
      }
};

const updateByFilter = async (filter, value) => {
    try {
      const userUpd = await userServiceDao.update(filter, value);
      return(userUpd);
      } catch (error) {
        console.error(error);
        throw error;
      }
};

const getRandomUser = async (req, res) => {
    try {
      const randomUser = await userServiceDao.randomUser();
      res.status(201).send(userUpd);
      } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({error: error, message: "No se pudo generar un usuario random"});
      }
};


const uploadFiles = async (req, res) => {
    try {
    const { profiles, documents } = req.files

    const loadedFiles = {
      documents: documents ? documents.map((document) => document.filename) : [],
      profile: profiles ? profiles.map((profile) => profile.filename) : [],
    }
  
    //  store documents in users
    let allDocuments = []
  
    if (profiles) allDocuments = [...allDocuments, ...profiles]
    if (documents) allDocuments = [...allDocuments, ...documents]
  
    const formatedDocuments = allDocuments.map((document) => ({
      name: document.filename,
      reference: extractToRelativePath(document.path, config.multerDest),
    }))
  
    await userServiceDao.addDocuments(req.user.id, formatedDocuments)
  
    res.sendSuccessWithPayload({
      message: 'Files uploaded',
      payload: loadedFiles,
    })

    
    } catch (error) {
        console.error(error);
        throw error;
    }
  }
  
const switchPremiumRole = async (req, res) => {
    const { uid } = req.params
    const userId = castToMongoId(uid)    
  
    const user = await userServiceDao.getBy(userId)
  
    if (!user) {
      res.sendNotFound({
        error: `User with id "${userId}" not found`,
      })
    }
  
    if (!isValidRole(user.role, ALL_USER_ROLES_WITHOUT_ADMIN)) {
      return ErrorService.createValidationError({
        name: 'InvalidRole',
        message: `User with id "${userId}" has an invalid role "${user.role}"`,
        status: 400,
        code: EErrors.INVALID_VALUES,
      })
    }
  
    if (user.role === USER_ROLES.USER) {
      // Validate if user has documents of (indetification, proof of address, proof of account state)
      const NECESSARY_FILES = ['identification', 'proofOfAddress', 'proofOfAccountState']
  
      const namesOfFiles = user.documents.map((document) => extractOriginalName(document.name))
  
      const missingFiles = NECESSARY_FILES.filter((file) => !namesOfFiles.includes(file))
  
      if (missingFiles.length > 0) {
        return ErrorService.createValidationError({
          name: 'InsufficientDocuments',
          message: `User with id "${userId}" has not all the necessary documents to be premium. Missing files: ${missingFiles.join(
            ', '
          )}`,
          status: 400,
          code: EErrors.INCOMPLETE_VALUES,
        })
      }
    }
  
    const newRole = user.role === USER_ROLES.USER ? USER_ROLES.PREMIUM : USER_ROLES.USER
  
    const updatedUser = await userServiceDao.updateUser(userId, { role: newRole }, { lean: true })
     
    res.sendSuccessWithPayload({
      message: `Switch role user from ${user.role} to ${updatedUser.role}`,
      payload: updatedUser,
    })
  }

  const deleteInactiveUsers = async (req, res) => {
    const inactiveUsers = await userRepository.getInactiveUsers(INACTIVE_CONNECTION_PARAM)
  
    if (inactiveUsers.length === 0) {
      return res.sendSuccessWithPayload({
        message: 'No inactive users found',
        payload: {
          deletedCount: 0,
          deletedUsers: [],
        },
      })
    }
  
    // send emails
    inactiveUsers.forEach(async (user) => {
      await mailService.sendDeletedAccountMail({
        to: user.email,
        name: user.firstName,
        reason: 'inactividad',
      })
    })
  
    const inactiveUsersIds = inactiveUsers.map((user) => user._id)
  
    // delete users
    const deletedUsers = await Promise.all(
      inactiveUsersIds.map((userId) => userServiceDao.removeUser(userId))
    )
  
    const formatedDeletedUsers = deletedUsers.map((user) => new CurrentUserDTO(user))
  
    res.sendSuccessWithPayload({
      message: 'Inactive users deleted',
      payload: {
        deletedCount: deletedUsers.length,
        deletedUsers: formatedDeletedUsers,
      },
    })
  }

  const deleteUser = async (req, res) => {
    const { uid } = req.params
  
    const userId = castToMongoId(uid)
  
    const user = await userServiceDao.getBy(userId)
  
    if (!user) {
      res.sendNotFound({
        error: `User with id "${userId}" not found`,
      })
    }
  
    await userServiceDao.removeUser(userId)
  
    res.sendSuccess({
      message: `User with id "${userId}" deleted`,
    })
  

    await mailService.sendDeletedAccountMail({
      to: user.email,
      name: user.firstName,
      reason: 'eliminación de cuenta por parte del administrador',
    })

  }

export default {
    getAll,
    createUser,
    getById,
    findByUsername,
    updateUser,
    updateByFilter,
    getRandomUser,
    switchPremiumRole,
    uploadFiles,
    deleteInactiveUsers,
    deleteUser,
  }