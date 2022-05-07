import express from 'express';

import authRouter from './authRouter.js';
import transactionsRouter from './transactionsRouter.js';
import usersRouter from './usersRouter.js';

const router = express.Router();

router.use(authRouter);
router.use(transactionsRouter);
router.use(usersRouter);

export default router;