// Firebase and MongoDB configurations
const firebaseConfig = {
  apiKey: "AIzaSyCoHLdAMd032Q5cIa33aEMeJSnxsbVlbjk",
  authDomain: "collabcampus-e6a9c.firebaseapp.com",
  projectId: "collabcampus-e6a9c",
  storageBucket: "collabcampus-e6a9c.firebasestorage.app",
  messagingSenderId: "719959614014",
  appId: "1:719959614014:web:304f675676ed64a44ea76f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// MongoDB Connection
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://siddharth20042004:1UqMFPcNNugsQx2g@interschool.2yn66.mongodb.net/?retryWrites=true&w=majority&appName=interschool";
const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Replace with your actual Vercel deployment URL
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : 'https://your-vercel-app.vercel.app/api';

// Connect to both Firebase and MongoDB when the document loads
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Check for Petra wallet
    if (typeof window.petra === 'undefined') {
      alert('Please install the Petra wallet extension to continue.');
      return;
    }

    // Connect to MongoDB
    await mongoClient.connect();
    console.log("Connected to MongoDB!");

    // Connect Wallet button event listener
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
  } catch (error) {
    console.error("Error during initialization:", error);
  }

  let orders = [];

  // Connect Wallet
  document.getElementById('connectWallet').addEventListener('click', connectWallet);

  async function connectWallet() {
    const walletDisplay = document.getElementById("walletAddress");
    const connectButton = document.getElementById("connectWallet");
    
    try {
        const account = await window.petra.connect();
        if (account) {
            // Update wallet address display
            walletDisplay.innerHTML = `
                <span style="color: #28a745;">✓ Wallet Connected</span>
                <br>
                <small style="color: #666; font-size: 12px;">
                    ${account.address.substring(0, 6)}...${account.address.substring(account.address.length - 4)}
                </small>
            `;
            walletDisplay.classList.add('connected');
            
            // Update button text and style
            connectButton.innerHTML = "Wallet Connected";
            connectButton.style.backgroundColor = "#07294d";
            connectButton.style.color = "#ffc600";
            connectButton.style.borderColor = "#07294d";
            
            // Store wallet address in localStorage
            localStorage.setItem("walletId", account.address);
            console.log("Wallet connected and saved:", account.address);
        } else {
            walletDisplay.textContent = "Not Connected";
            walletDisplay.classList.remove('connected');
            connectButton.innerHTML = "Connect Wallet";
        }
    } catch (error) {
        walletDisplay.textContent = "Connection Failed";
        walletDisplay.style.color = "#dc3545";
        connectButton.innerHTML = "Connect Wallet";
        console.error("Error connecting to wallet:", error);
    }
}


  // Purchase Book and Store Order
  async function purchaseBook(bookId, bookPrice) {
    try {
        const response = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                walletId: window.petra.account.address,
                item: bookId,
                price: bookPrice,
                createdAt: new Date()
            })
        });
        
        if (!response.ok) {
            throw new Error('Transaction failed');
        }
        
        const data = await response.json();
        console.log('Transaction saved:', data);
        
        // Update UI
        loadOrders();
        
    } catch (error) {
        console.error('Error processing payment:', error);
        alert('Error processing payment: ' + error.message);
    }
}

  // Display Orders on the Orders Page
  function loadOrders() {
    fetch(`${API_URL}/transactions`)
        .then(response => response.json())
        .then(data => {
            const ordersList = document.getElementById('orderList');
            ordersList.innerHTML = '';
            
            data.forEach(transaction => {
                const transactionDiv = document.createElement('div');
                transactionDiv.classList.add("order-log");
                transactionDiv.innerHTML = `
                    <span>Transaction Record</span>
                    <span>ID: ${transaction._id}</span>
                    <span>Item: ${transaction.item}</span>
                    <span>Amount: $${transaction.price}</span>
                    <span>Date: ${new Date(transaction.createdAt).toLocaleString()}</span>
                    <span>Status: Completed</span>
                `;
                ordersList.insertBefore(transactionDiv, ordersList.firstChild);
            });
        })
        .catch(error => {
            console.error('Error fetching transactions:', error);
        });
}

  // Add event listener to purchase buttons
  document.querySelectorAll('.purchaseButton').forEach(button => {
      button.addEventListener('click', function() {
          const bookId = this.getAttribute('data-book-id');
          const bookPrice = this.getAttribute('data-book-price');
          purchaseBook(bookId, bookPrice);
      });
  });

  // Load orders if on the Orders page
  if (document.getElementById('ordersContainer')) {
      loadOrders();
  }
});

// Add this to index.js
window.addEventListener('beforeunload', async () => {
  try {
    await mongoClient.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
});

function addNewTransaction(transaction) {
    const ordersList = document.getElementById('orderList');
    const transactionDiv = document.createElement('div');
    transactionDiv.classList.add("order-log", "animate__animated", "animate__fadeInDown");
    
    transactionDiv.innerHTML = `
        <span>Transaction Record</span>
        <span>ID: ${transaction._id.substring(0, 8)}...</span>
        <span>Item: ${transaction.item}</span>
        <span>Amount: $${transaction.price}</span>
        <span>Date: ${new Date(transaction.createdAt).toLocaleString()}</span>
        <span>Status: Completed</span>
    `;
    
    // Insert at the beginning of the list
    if (ordersList.firstChild) {
        ordersList.insertBefore(transactionDiv, ordersList.firstChild);
    } else {
        ordersList.appendChild(transactionDiv);
    }

    // Smooth scroll to top
    ordersList.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function loadTransactions() {
    fetch('http://localhost:3000/transactions')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetched transactions:", data);
            const ordersList = document.getElementById('orderList');
            if (!ordersList) {
                console.error('orderList element not found');
                return;
            }
            ordersList.innerHTML = '';
            
            // Sort transactions by date, newest first
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            if (data.length === 0) {
                ordersList.innerHTML = '<div class="order-log">No transactions found</div>';
                return;
            }
            
            data.forEach(transaction => {
                const transactionDiv = document.createElement('div');
                transactionDiv.classList.add("order-log");
                transactionDiv.innerHTML = `
                    <span>Transaction Record</span>
                    <span>ID: ${transaction._id.substring(0, 8)}...</span>
                    <span>Item: ${transaction.item}</span>
                    <span>Amount: $${transaction.price}</span>
                    <span>Date: ${new Date(transaction.createdAt).toLocaleString()}</span>
                    <span>Status: Completed</span>
                `;
                ordersList.appendChild(transactionDiv);
            });
        })
        .catch(error => {
            console.error("Error fetching transactions:", error);
            const ordersList = document.getElementById('orderList');
            if (ordersList) {
                ordersList.innerHTML = `<div class="order-log">Error loading transactions: ${error.message}</div>`;
            }
        });
}

// Add this function to check server connection
async function checkServerConnection() {
    try {
        const response = await fetch('http://localhost:3000');
        if (!response.ok) {
            throw new Error('Server not responding');
        }
        console.log('Server connection established');
        return true;
    } catch (error) {
        console.error('Server connection failed:', error);
        return false;
    }
}

// Call this before loading transactions
checkServerConnection().then(isConnected => {
    if (isConnected) {
        loadTransactions();
    } else {
        const ordersList = document.getElementById('orderList');
        if (ordersList) {
            ordersList.innerHTML = '<div class="order-log">Unable to connect to server</div>';
        }
    }
});
