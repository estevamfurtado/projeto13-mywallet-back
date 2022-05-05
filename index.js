import express, { json } from 'express';
import cors from 'cors';
import chalk from 'chalk';

import { signUp, signIn, logOut } from './controllers/authController.js';
import { getTransactions, postNewTransaction, editTransaction, deleteTransaction } from './controllers/transactionsController.js';
import { getUser } from './controllers/userController.js';


const app = express(); // cria um servidor
app.use(cors());
app.use(json());

app.post('/signUp', signUp);
app.post('/signIn', signIn);
app.post('/logOut', logOut);

app.get('/users', getUser);

app.get('/transactions', getTransactions);
app.post('/transactions', postNewTransaction);
app.put('/transactions/:transactionId', editTransaction);
app.delete('/transactions/:transactionId', deleteTransaction);


app.listen(5000, () => console.log(`Vivo em http://localhost:5000 !`));

