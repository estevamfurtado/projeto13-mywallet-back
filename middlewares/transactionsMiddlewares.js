import mywalletDb from '../mywalletDb.js'
import joi from 'joi';



export async function validateTokenAndGetUser(req, res, next) {

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if (!token) { return res.sendStatus(401) }

    try {
        const session = await mywalletDb.collection("sessions").findOne({ token });
        if (!session) {
            return res.sendStatus(401);
        }

        const user = await mywalletDb.collection("users").findOne({ _id: session.userId })
        if (!user) {
            return res.sendStatus(401);
        }
        delete user.password;
        res.locals.user = user;

    } catch (e) {
        return res.sendStatus(500);
    }

    next();
}



export async function validateTransactionInBody(req, res, next) {

    const transactionSchema = joi.object({
        description: joi.string().required(),
        value: joi.number().required(),
        date: joi.date().required(),
        type: joi.valid('credit', 'debt').required()
    })

    const transaction = req.body;
    const validation = transactionSchema.validate(transaction);
    if (validation.error) {
        res.sendStatus(401);
        return;
    }
    res.locals.transaction = transaction;

    next();
}
