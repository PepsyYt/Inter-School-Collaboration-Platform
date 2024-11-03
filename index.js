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

  // Get the Enroll Now button with more specific selector
  const enrollButton = document.querySelector('.price-button .main-btn');
  console.log('Found enroll button:', !!document.querySelector('.price-button .main-btn'));
  
  if (enrollButton) {
      enrollButton.addEventListener('click', async (event) => {
          // Prevent form submission/page refresh
          event.preventDefault();
          
          // Disable button and show loading state
          enrollButton.disabled = true;
          enrollButton.textContent = 'Processing...';
          
          try {
              // Get course price
              const priceElement = document.querySelector('.price-button span b');
              if (!priceElement) {
                  throw new Error('Price element not found');
              }
              
              const price = parseFloat(priceElement.textContent.replace('$', ''));
              console.log('Processing enrollment for price:', price);

              // Connect wallet
              const account = await window.petra.connect();
              if (!account) {
                  throw new Error('Wallet connection failed');
              }
              console.log('Wallet connected:', account.address);

              // Create payment payload
              const amountInOctas = (price * 100000000).toString();
              const payload = {
                  type: "entry_function_payload",
                  function: "0x1::coin::transfer",
                  type_arguments: ["0x1::aptos_coin::AptosCoin"],
                  arguments: [
                      CONTRACT_ADDRESS,
                      amountInOctas
                  ]
              };

              // Process transaction
              const transaction = await window.petra.signAndSubmitTransaction(payload);
              console.log('Transaction submitted:', transaction.hash);

              // Record enrollment
              const orderData = {
                  courseId: window.location.pathname,
                  price: price,
                  walletAddress: account.address,
                  transactionHash: transaction.hash,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp()
              };
              
              await db.collection('enrollments').add(orderData);
              alert('Successfully enrolled in the course!');
              
          } catch (error) {
              console.error('Enrollment failed:', error);
              alert('Failed to process enrollment: ' + error.message);
          } finally {
              // Reset button state
              enrollButton.disabled = false;
              enrollButton.textContent = 'Enroll Now';
          }
      });
  } else {
      console.error('Enroll button not found');
  }

  // Purchase Book and Store Order
  /* async function purchaseBook(bookId, bookPrice) {
    console.log("this works")
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
  } */

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
