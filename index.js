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
          const { address } = await window.petra.connect();
          document.getElementById('walletAddress').innerText = `Wallet Address: ${address}`;
      } catch (error) {
          console.error('Connection error:', error);
          alert('Failed to connect to wallet. Please try again.');
      }
  }

  async function purchaseBook(event, bookId, bookPrice) {
      // Prevent the default action of the link
      event.preventDefault(); 

      try {
          const account = await window.petra.connect();
          const payload = {
              type: "entry_function_payload",
              function: `0xd362e83f88003a664a9aa6c52c5142f14de89377e776bd401ef7386705e4c3a8::aptos_bookstore::buy_book`,
              type_arguments: [],
              arguments: [bookId, bookPrice]
          };

          // Use sendTransaction to initiate payment
          const response = await window.petra.sendTransaction(payload);
          console.log('Transaction successful!', response);
          alert('Transaction successful!');

          // Update orders
          updateOrders(bookId, bookPrice);
      } catch (error) {
          console.error('Error processing payment:', error);
          alert('Error processing payment: ' + error.message);
      }
  }

  function updateOrders(bookId, bookPrice) {
      orders.push({ id: bookId, price: bookPrice });
      const orderList = document.getElementById('orderList');
      orderList.innerHTML = ''; // Clear previous orders
      orders.forEach(order => {
          orderList.innerHTML += `<p>Book ID: ${order.id}, Price: $${order.price}</p>`;
      });
  }
});
