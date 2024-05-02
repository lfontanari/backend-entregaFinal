 
import UsersRouter from './users.router.js'


const instanceUserRouter = new UsersRouter()


export const usersRouter = instanceUserRouter.getRouter()