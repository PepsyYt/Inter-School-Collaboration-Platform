// Firebase configuration
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

// Reference to Firestore
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.petra === 'undefined') {
      alert('Please install the Petra wallet extension to continue.');
      return;
  }

  let orders = [];

  // Connect Wallet
  document.getElementById('connectWallet').addEventListener('click', connectWallet);

  async function connectWallet() {
    try {
        const account = await window.petra.connect();
        if (account) {
            document.getElementById("walletAddress").innerText = `Wallet Address: ${account.address}`;
            console.log("Wallet connected:", account.address);
        } else {
            console.log("Connection canceled by user");
        }
    } catch (error) {
        console.error("Error connecting to wallet:", error);
    }
}


  // Purchase Book and Store Order
  async function purchaseBook(bookId, bookPrice) {
      try {
          // Call the Petra wallet to send transaction
          const transaction = await window.petra.sendTransaction({
              to: contractAddress,
              amount: bookPrice,
              data: bookId
          });

          // Add order to Firestore
          const orderData = {
              bookId,
              bookPrice,
              walletAddress: window.petra.account.address,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
          };
          await db.collection('orders').add(orderData);
          alert('Purchase successful! Your order has been recorded.');
      } catch (error) {
          console.error('Error processing payment:', error);
          alert('Error processing payment: ' + error.message);
      }
  }

  // Display Orders on the Orders Page
  function loadOrders() {
      const ordersContainer = document.getElementById('ordersContainer');
      ordersContainer.innerHTML = '';

      db.collection('orders').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
              const order = doc.data();
              const orderItem = document.createElement('div');
              orderItem.innerHTML = `
                  <p>Book ID: ${order.bookId}</p>
                  <p>Price: $${order.bookPrice}</p>
                  <p>Wallet Address: ${order.walletAddress}</p>
                  <p>Timestamp: ${order.timestamp.toDate()}</p>
              `;
              ordersContainer.appendChild(orderItem);
          });
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
