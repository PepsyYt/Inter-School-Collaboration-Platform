const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// In-memory store for orders
let orders = [];

// Endpoint to get all orders
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// Endpoint to add a new order
app.post('/api/purchase', (req, res) => {
    const { bookId, bookPrice } = req.body;
    const newOrder = { bookId, bookPrice, date: new Date() };
    orders.push(newOrder);
    res.status(200).json({ success: true, order: newOrder });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
