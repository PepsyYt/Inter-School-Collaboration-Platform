// Connect to the Petra wallet
async function connectPetraWallet() {
    if (typeof window.petra !== 'undefined') {
        try {
            const account = await window.petra.connect();
            console.log('Petra wallet connected:', account);
            document.getElementById("walletAddress").innerText = `Wallet Address: ${account.address}`;
        } catch (error) {
            console.error('Error connecting to Petra wallet:', error.message);
        }
    } else {
        console.error('Petra wallet not found. Please install it from the official site.');
    }
  }
  
  // Define the address of your deployed Aptos contract
  const contractAddress = "0xd362e83f88003a664a9aa6c52c5142f14de89377e776bd401ef7386705e4c3a8"; // Update this line with the correct address
   // Replace with your Aptos contract address
  
  async function purchaseBook(bookId, bookPrice, event) {
    //event.preventDefault(); // Prevent the default anchor behavior
    try {
        const account = await window.petra.connect();
        const priceInUnits = bookPrice * Math.pow(2, 8); // Convert to the smallest unit if needed
        
        // Initiate payment
        const txHash = await window.petra.sendTransaction({
            to: contractAddress,
            value: priceInUnits, // Amount to send (convert to appropriate units)
            data: bookId // Optional: can track which book was purchased
        });
  
        console.log("Transaction successful:", txHash);
        // Optionally redirect to orders page or update UI here
    } catch (error) {
        console.error("Error processing payment:", error.message);
    }
  }
  
  // Add event listeners
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure the Petra wallet is loaded
    if (typeof window.petra === 'undefined') {
        console.error('Petra wallet not found. Please install it to continue.');
        alert("Petra wallet not found. Please install it to continue.");
        return;
    }
  
    // Function to connect to the wallet
    const connectWalletButton = document.getElementById("connectWalletButton");
    if (connectWalletButton) {
        connectWalletButton.addEventListener("click", connectPetraWallet);
    } else {
        console.error("Connect Wallet button not found in DOM.");
    }
  });
  