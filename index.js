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

// Optional: Send a transaction using Aptos wallet
async function sendTransaction() {
  try {
    const payload = {
      type: 'entry_function_payload',
      function: '0x001::module_name::function_name', // Replace with your Move module details
      arguments: [], // Add any arguments your function needs
      type_arguments: []
    };

    const txn = await window.aptos.signAndSubmitTransaction(payload);
    console.log('Transaction sent:', txn.hash);

    const txnDetails = await aptosClient.getTransactionByHash(txn.hash);
    console.log('Transaction status:', txnDetails);
  } catch (error) {
    console.error('Transaction failed:', error);
  }
}