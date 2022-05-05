import express, { json } from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import joi from 'joi';
import dayjs from 'dayjs';

dotenv.config();

const app = express(); // cria um servidor
app.use(cors());
app.use(json());

const mongoClient = new MongoClient(process.env.MONGO_URI);