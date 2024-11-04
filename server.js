const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

// Use the MongoDB Atlas URI instead of localhost
const uri = "mongodb+srv://siddharth20042004:1UqMFPcNNugsQx2g@interschool.2yn66.mongodb.net/?retryWrites=true&w=majority&appName=interschool";
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        return client.db("spare"); // Your database name
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}

// Routes
app.get("/", (req, res) => {
    res.send("lol");
});

app.get("/add-transaction", async (req, res) => {
    const { walletId, item, price } = req.query;

    if (!walletId || !item || !price) {
        return res.status(400).send("walletId and item are required");
    }

    try {
        const db = await connectDB();
        const newTransaction = {
            walletId,
            item,
            price,
            createdAt: new Date()
        };
        const result = await db.collection("transactions").insertOne(newTransaction);
        res.status(201).send({ message: "Transaction saved", transactionId: result.insertedId, price, item });
    } catch (err) {
        console.error("Error saving transaction:", err);
        res.status(500).send("Internal server error");
    }
});

app.get('/transactions', async (req, res) => {
    try {
        const db = await connectDB();
        const transactions = await db.collection("transactions")
            .find()
            .sort({ createdAt: -1 })
            .toArray();
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});