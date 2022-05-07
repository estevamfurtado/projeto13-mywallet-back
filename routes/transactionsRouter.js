import express from 'express';
import { getTransactions, postNewTransaction, editTransaction, deleteTransaction } from '../controllers/transactionsController.js';
import { validateTokenAndGetUser, validateTransactionInBody } from '../middlewares/transactionsMiddlewares.js';

const transactionsRouter = express.Router();

transactionsRouter.get('/transactions', validateTokenAndGetUser, getTransactions);
transactionsRouter.post('/transactions', validateTokenAndGetUser, validateTransactionInBody, postNewTransaction);
transactionsRouter.put('/transactions/:transactionId', validateTokenAndGetUser, validateTransactionInBody, editTransaction);
transactionsRouter.delete('/transactions/:transactionId', validateTokenAndGetUser, deleteTransaction);

export default transactionsRouter;