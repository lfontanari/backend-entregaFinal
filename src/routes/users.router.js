import express from 'express';
import {authToken} from '../utils.js';


// importo un controller
import { getAll, createUser, getById, findByUsername,updateUser, updateByFilter, getRandomUser ,
    uploadFiles, switchPremiumRole } from '../controllers/user.controller.js';
import { uploaders } from '../middlewares/multer.middleware.js'
import { validateUserId } from '../middlewares/users.middleware.js'
import {
    ALL_USER_ROLES_WITHOUT_ADMIN,
    USER_ROLES
  } from '../constants/contants.js';

const router = express.Router();

// get
router.get('/', getAll);
router.get('/:userId', authToken, getById);
router.get('/:username',authToken, findByUsername);
router.get('/random', getRandomUser);


// post
router.post('/', createUser);
router.post('/:uid/documents', [...ALL_USER_ROLES_WITHOUT_ADMIN],validateUserId,
    uploaders.fields([
    {
        name: 'profiles',
        maxCount: 1,
    },
    {
        name: 'documents',
    },
    ]), uploadFiles);
// put
router.put('/:uid', updateUser);
router.put('/filter', updateByFilter);
router.put('/premium/:uid', [USER_ROLES.ADMIN], switchPremiumRole);
 

export default router;