import express from 'express';
import AuthController from '../controller/auth.controller';

const router = express.Router();

router.route('/login').post(AuthController.login);
router.route('/logout').post(AuthController.logout);

export default router;