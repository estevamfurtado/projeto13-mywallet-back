import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import joi from 'joi';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';


dotenv.config();
const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect();
const mywalletDb = mongoClient.db("mywallet");


const transactionSchema = joi.object({

    description: joi.string().required(),
    value: joi.number().required(),
    date: joi.date().required(),
    type: joi.valid('credit', 'debt').required()

})


export async function getTransactions(req, res) {
    const { authorization } = req.headers;
    try {
        const user = await getUserFromToken(authorization);
        if (user) {
            const transactions = await mywalletDb.collection("transactions").find({ userId: user._id }).toArray();
            transactions.forEach(t => {
                delete t.userId;
            })
            res.send(transactions);
        } else {
            res.sendStatus(400);
        }
    } catch {
        res.sendStatus(400);
    }
}

export async function postNewTransaction(req, res) {

    const { authorization } = req.headers;
    const transaction = req.body;
    const validation = transactionSchema.validate(transaction);
    if (validation.error) {
        res.sendStatus(401);
        return;
    }

    transaction.value = Number(transaction.value);
    transaction.date = dayjs(transaction.date);

    console.log(transaction);

    try {
        const user = await getUserFromToken(authorization);
        if (user) {
            await mywalletDb.collection("transactions").insertOne({
                ...transaction, userId: user._id
            })
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } catch {
        res.sendStatus(400);
    }
}

export async function editTransaction(req, res) {

    const { transactionId } = req.params;
    const { authorization } = req.headers;
    const transaction = req.body;

    const validation = transactionSchema.validate(transaction);
    if (validation.error) {
        console.log(validation.error.details);
        res.sendStatus(401);
        return;
    }

    transaction.value = Number(transaction.value);
    transaction.date = dayjs(transaction.date);

    console.log(transaction);

    try {
        const user = await getUserFromToken(authorization);
        if (user) {

            await mywalletDb.collection("transactions").updateOne(
                { _id: new ObjectId(transactionId) },
                { $set: { ...transaction } }
            )

            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } catch {
        res.sendStatus(400);
    }
}

export async function deleteTransaction(req, res) {

    const { transactionId } = req.params;
    const { authorization } = req.headers;

    try {
        const user = await getUserFromToken(authorization);
        if (user) {
            await mywalletDb.collection("transactions").deleteOne({ _id: new ObjectId(transactionId) })
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } catch {
        res.sendStatus(400);
    }
}



async function getUserFromToken(auth) {

    const token = auth?.replace('Bearer ', '');
    if (!token) { return null }

    const session = await mywalletDb.collection("sessions").findOne({ token });
    if (!session) { return null }

    const user = await mywalletDb.collection("users").findOne({ _id: session.userId })
    if (user) {
        delete user.password;
        return user;
    } else {
        return null;
    }
}