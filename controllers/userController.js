import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';



dotenv.config();
const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect();
const mywalletDb = mongoClient.db("mywallet");


export async function getUser(req, res) {

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if (!token) { return res.sendStatus(401); }
    console.log(token);

    const session = await mywalletDb.collection("sessions").findOne({ token });
    if (!session) { return res.sendStatus(401); }

    const user = await mywalletDb.collection("users").findOne({ _id: session.userId })

    if (user) {
        delete user.password;
        res.send(user);
    } else {
        res.sendStatus(401);
    }
}