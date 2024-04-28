// importar capa servicios
import  UserServiceDao  from '../services/db/dao/user.dao.js';
import config  from '../config/config.js';

const userServiceDao = new UserServiceDao();

export const getAll = async (req,res) => {
    try {
        let users = await userServiceDao.getAll();
        res.send(users);

    } catch (error) {
        console.error(error);
        res
            .status(500)
            .send({error: error, message: "No se pudo obtener los usuarios"});
    }
};

export const createUser = async (req, res) => {
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

export const getById = async (req, res) => {

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

export const findByUsername = async (username) => {
    try {    
        const user = await userServiceDao.findByUsername(username);
        return(user);
    } catch (error) {
        console.error(error);
        throw error;
    }

};

export const updateUser = async (req, res) => {
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

export const updateByFilter = async (filter, value) => {
    try {
      const userUpd = await userServiceDao.update(filter, value);
      return(userUpd);
      } catch (error) {
        console.error(error);
        throw error;
      }
};

export const getRandomUser = async (req, res) => {
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


export const uploadFiles = async (req, res) => {
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
  
export const switchPremiumRole = async (req, res) => {
    const { uid } = req.params
    const userId = castToMongoId(uid)   //---------------falta!!!!!
  
    const user = await userServiceDao.getUserById(userId)
  
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
  