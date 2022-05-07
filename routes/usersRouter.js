import express from 'express';
import { getUser } from '../controllers/userController.js';
import { validateTokenAndGetUser } from '../middlewares/transactionsMiddlewares.js';

const usersRouter = express.Router();

usersRouter.get('/users', validateTokenAndGetUser, getUser);

export default usersRouter;