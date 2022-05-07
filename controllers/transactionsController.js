import mywalletDb from '../mywalletDb.js'
import { ObjectId } from "mongodb";


export async function getTransactions(req, res) {
    const { user } = res.locals;
    try {
        const transactions = await mywalletDb.collection("transactions").find({ userId: user._id }).toArray();
        transactions.forEach(t => {
            delete t.userId;
        })
        res.send(transactions);
    } catch (e) {
        res.sendStatus(400);
    }
}

export async function postNewTransaction(req, res) {

    const { user, transaction } = res.locals;
    transaction.value = Number(transaction.value);

    try {
        await mywalletDb.collection("transactions").insertOne({
            ...transaction, userId: user._id
        })
        res.sendStatus(200);
    } catch {
        res.sendStatus(400);
    }
}

export async function editTransaction(req, res) {

    const { transactionId } = req.params;
    const { transaction } = res.locals;
    transaction.value = Number(transaction.value);

    try {
        await mywalletDb.collection("transactions").updateOne(
            { _id: new ObjectId(transactionId) },
            { $set: { ...transaction } }
        )
        res.sendStatus(200);
    } catch {
        res.sendStatus(400);
    }
}

export async function deleteTransaction(req, res) {
    const { transactionId } = req.params;
    try {
        await mywalletDb.collection("transactions").deleteOne({ _id: new ObjectId(transactionId) })
        res.sendStatus(200);
    } catch {
        res.sendStatus(400);
    }
}

