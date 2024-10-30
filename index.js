document.addEventListener('DOMContentLoaded', () => {
  // Ensure the Aptos wallet is loaded
  if (typeof window.aptos === 'undefined') {
      console.error('Aptos wallet not found. Please install it to continue.');
      alert("Aptos wallet not found. Please install it to continue.");
      return;
  }

  // Function to connect to the wallet
  async function connectWallet() {
      try {
          // Request connection to the wallet
          const { address } = await window.aptos.connect();
          console.log("Wallet connected:", address);
          // Display the wallet address on the page
          document.getElementById("walletAddress").innerText = `Wallet Address: ${address}`;
      } catch (error) {
          console.error("Error connecting to the wallet:", error);
      }
  }

  // Add event listener to the Connect Wallet button
  const connectWalletButton = document.getElementById("connectWallet");
  if (connectWalletButton) {
      connectWalletButton.addEventListener("click", connectWallet);
  } else {
      console.error("Connect Wallet button not found in DOM.");
  }
});
