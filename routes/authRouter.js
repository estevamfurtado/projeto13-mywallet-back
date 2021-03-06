import express from 'express';
import { signUp, signIn, logOut } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/signUp', signUp);
authRouter.post('/signIn', signIn);
authRouter.post('/logOut', logOut);

export default authRouter;