import { MongoClient } from "mongodb";
import express from "express";
import cors from 'cors'

const url = "mongodb://localhost:27017/";
const client = new MongoClient(url);

await client.connect();
console.log("Connected to MongoDB");

const db = client.db("spare");
const transactions = db.collection("transactions");

const app = express();
app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
    res.send("lol");
});

app.get("/add-transaction", async (req, res) => {
    const { walletId, item, price } = req.query;

    if (!walletId || !item || !price) {
        return res.status(400).send("walletId and item are required");
    }

    try {
        const newTransaction = {
            walletId,
            item,
            price,
            createdAt: new Date()
        };
        const result = await transactions.insertOne(newTransaction);
        res.status(201).send({ message: "Transaction saved", transactionId: result.insertedId, price, item });
    } catch (err) {
        console.error("Error saving transaction:", err);
        res.status(500).send("Internal server error");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 