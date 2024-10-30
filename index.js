import { AptosClient } from 'aptos';

// Initialize the Aptos client (use Testnet or Mainnet)
const aptosClient = new AptosClient('https://fullnode.testnet.aptoslabs.com');

// Select DOM elements
const connectWalletButton = document.getElementById('connectWallet');
const walletAddressDiv = document.getElementById('walletAddress');

// Connect wallet and display the address
connectWalletButton.addEventListener('click', async () => {
  try {
    const account = await window.aptos.connect();
    const walletAddress = account.address;
    walletAddressDiv.textContent = `Wallet Address: ${walletAddress}`;
    console.log('Connected to wallet:', walletAddress);
  } catch (error) {
    console.error('Failed to connect wallet:', error);
  }
});