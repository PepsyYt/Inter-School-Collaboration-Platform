const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from root directory

// MongoDB Connection
const uri = "mongodb+srv://siddharth20042004:1UqMFPcNNugsQx2g@interschool.2yn66.mongodb.net/?retryWrites=true&w=majority&appName=interschool";
const client = new MongoClient(uri);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/transactions', async (req, res) => {
  try {
    await client.connect();
    const db = client.db("spare");
    const result = await db.collection("transactions").insertOne({
      ...req.body,
      createdAt: new Date()
    });
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

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;