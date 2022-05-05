import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';



dotenv.config();
const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect();
const mywalletDb = mongoClient.db("mywallet");


const signUpSchema = joi.object({
    username: joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: joi.string()
        .required(),
    repeatPassword: joi.ref('password'),
    email: joi.string()
        .email()
        .required()
})


const signInSchema = joi.object({
    password: joi.string()
        .required(),
    email: joi.string()
        .email()
        .required()
})





export async function signUp(req, res) {

    const { username, email, password, repeatPassword } = req.body;
    const validation = signUpSchema.validate({ username, email, password, repeatPassword });

    if (validation.error) {
        console.log(validation.error.details)
        res.sendStatus(401);
        return;
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    try {

        const prevUser = await mywalletDb.collection('users').findOne({ email });

        if (prevUser) {
            // console.log(`email já cadastrado`);
            res.sendStatus(401);
            return;
        }

        await mywalletDb.collection('users').insertOne({ username, email, password: passwordHash });
        res.sendStatus(201);
    }
    catch {
        res.sendStatus(401);
    }
}


export async function signIn(req, res) {

    const { email, password } = req.body;

    const validation = signInSchema.validate({ email, password });
    if (validation.error) {
        console.log(validation.error.details)
        res.sendStatus(401);
        return;
    }

    try {
        const user = await mywalletDb.collection('users').findOne({ email });
        console.log(user);
        if (user && bcrypt.compareSync(password, user.password)) {
            console.log("passou cripto");
            const token = uuid();
            await mywalletDb.collection("sessions").insertOne({
                userId: user._id,
                token
            })
            res.send(token);
        }
        else { res.sendStatus(401); }
    }
    catch {
        res.sendStatus(401);
    }
}

export async function logOut(req, res) {
    console.log("log out!");
    res.sendStatus(201);
}