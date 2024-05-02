import {authToken} from '../utils.js';
import BaseRouter from './BaseRouter.js'

// importo un controller
import usersController from '../controllers/user.controller.js';
import { uploaders } from '../middlewares/multer.middleware.js'
import { validateUserId } from '../middlewares/users.middleware.js'
import { ALL_USER_ROLES_WITHOUT_ADMIN, USER_ROLES, ALL_USER_ROLES, PRIVACY_TYPES } from '../constants/constants.js';

export default class UserRouter extends BaseRouter {
    init() {
        
        this.get('/', [USER_ROLES.ADMIN], usersController.getAll);
       // this.get('/:userId',[...ALL_USER_ROLES], authToken, getById);
       
        this.get('/random', [...ALL_USER_ROLES] , usersController.getRandomUser);

        this.get('/:username',[...ALL_USER_ROLES], authToken, usersController.findByUsername);

        // post
        this.post('/', [USER_ROLES.ADMIN], usersController.createUser);

        this.post(
            '/:uid/documents',
            [...ALL_USER_ROLES_WITHOUT_ADMIN],
            validateUserId,
            uploaders.fields([
            {
                name: 'profiles',
                maxCount: 1,
            },
            {
                name: 'documents',
            },
            ]),
            usersController.uploadFiles
        );

        // put
        this.put('/:uid', [ALL_USER_ROLES], usersController.updateUser);
        this.put('/filter',[ALL_USER_ROLES], usersController.updateByFilter);
        this.put('/premium/:uid', [USER_ROLES.ADMIN], usersController.switchPremiumRole);   

        this.delete('/',[USER_ROLES.ADMIN], usersController.deleteInactiveUsers);
        this.delete('/:uid', [USER_ROLES.ADMIN], usersController.deleteUser)
    }
};