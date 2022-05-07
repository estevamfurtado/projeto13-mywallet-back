import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let mywalletDb = null;
try {
    const mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();
    mywalletDb = mongoClient.db("mywallet");
    console.log("Conexão com o myWallet MongoDB estabelecida!");
} catch (e) {
    console.log("Erro ao se conectar ao banco de dados!", e);
}

export default mywalletDb;