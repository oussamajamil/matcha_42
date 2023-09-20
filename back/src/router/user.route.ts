import express from 'express';
import UserController from '../controller/user.controller';

const router = express.Router();
router.route('/').get(UserController.getAllUser);
router.route('/').post(UserController.createUser);
router.route('/:id').get(UserController.getUserById);
router.route('/:id').patch(UserController.updateUser);
router.route('/:id').delete(UserController.deleteUser);

export default router;


