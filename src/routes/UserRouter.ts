import { Router } from 'express';
import { UserController } from "../controller/UserController";
import { authMiddleware } from '../middleware/AuthMiddleware';

const router = Router();
const userController = new UserController()

router.post('/createAccount', userController.createUser);
router.post('/login', userController.login);

router.use(authMiddleware)

router.get('/list-allUsersAccount', userController.returnAllUsersAccounts);
router.get('/list-userEmail/:email', userController.returnUserAccountByEmail);
router.patch('/changeEmail/:email', userController.updateUserEmail);
router.patch('/changePassword/:email', userController.updateUserPassword);
router.delete('/deleteAccount/:email', userController.deleteAccount);

export default router;