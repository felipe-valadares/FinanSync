// routes/userRoutes.ts
import { Router } from 'express';
import UserController from '../controllers/userController';

const userRouter = Router();
userRouter.get('/:id', UserController.getUser);
userRouter.get('/', UserController.getAllUsers);
userRouter.post('/', UserController.createUser);
userRouter.patch('/:id', UserController.updateUser);
userRouter.delete('/:id', UserController.deleteUser);

export default userRouter;
