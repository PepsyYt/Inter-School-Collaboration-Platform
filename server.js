const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Transactions endpoints
app.post('/api/transactions', async (req, res) => {
    try {
        await client.connect();
        const db = client.db("spare");
        const result = await db.collection("transactions").insertOne(req.body);
        res.json({ success: true, transactionId: result.insertedId });
    } catch (error) {
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
        res.status(500).json({ error: error.message });
    }
});

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = app;