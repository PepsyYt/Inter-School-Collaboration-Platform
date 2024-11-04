const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
let cachedDb = null;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }
    
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    // Add error handling for MongoDB connection
    client.on('error', (error) => {
        console.error('MongoDB connection error:', error);
    });

    client.on('disconnected', () => {
        console.log('MongoDB disconnected. Attempting to reconnect...');
        setTimeout(() => {
            client.connect();
        }, 5000);
    });

    const db = client.db('your_database_name');
    cachedDb = db;
    return db;
}

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/transactions', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const { walletId, item, price } = req.body;
        
        const result = await db.collection('transactions').insertOne({
            walletId,
            item,
            price,
            createdAt: new Date()
        });
        
        res.json({ success: true, transactionId: result.insertedId });
    } catch (error) {
        console.error('Transaction error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/transactions', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const transactions = await db.collection('transactions')
            .find()
            .sort({ createdAt: -1 })
            .toArray();
        
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: error.message });
    }
});

// Export for Vercel
module.exports = app;

// Start server if not in Vercel
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}