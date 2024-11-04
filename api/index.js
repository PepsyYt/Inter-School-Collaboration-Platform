const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = 'http://localhost:3000/api';

// MongoDB Connection
const uri = "mongodb+srv://siddharth20042004:1UqMFPcNNugsQx2g@interschool.2yn66.mongodb.net/?retryWrites=true&w=majority&appName=interschool";
const client = new MongoClient(uri);

// API Routes
app.post('/api/transactions', async (req, res) => {
    try {
        await client.connect();
        const db = client.db("spare");
        const result = await db.collection("transactions").insertOne(req.body);
        res.json({ success: true, transactionId: result.insertedId });
    } catch (error) {
        console.error('Transaction error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/transactions', async (req, res) => {
    try {
        await client.connect();
        const db = client.db("spare");
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

app.get('/api', (req, res) => {
  res.json({ message: 'API is working' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});