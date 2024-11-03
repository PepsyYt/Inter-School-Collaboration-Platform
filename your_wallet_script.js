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
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0xd362e83f88003a664a9aa6c52c5142f14de89377e776bd401ef7386705e4c3a8";

// Constants and Types
const MAX_RETRIES = 3;
const POLLING_INTERVAL = 2000; // 2 seconds
const TX_TIMEOUT = 30000; // 30 seconds

// UI State Management
const UIState = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error'
};

// Test purchase function with a minimal, static value
async function purchaseBook(bookId, price) {
    try {
        const account = await window.petra.connect();
        return await processPayment(price);
    } catch (error) {
        console.error("Purchase failed:", error.message);
        throw error;
    }
}

// Enhanced payment processing
async function processPayment(amount, retryCount = 0) {
    updateUIState(UIState.LOADING);
    try {
        // Input validation
        validatePaymentInput(amount);
        
        const amountInOctas = convertToOctas(amount);
        const payload = createTransactionPayload(amountInOctas);
        
        // Submit transaction with retry mechanism
        const txHash = await submitTransactionWithRetry(payload, retryCount);
        
        // Monitor transaction
        await monitorTransaction(txHash);
        
        updateUIState(UIState.SUCCESS);
        return txHash;
    } catch (error) {
        handlePaymentError(error, retryCount);
    }
}

// Helper functions
function validatePaymentInput(amount) {
    if (!amount || amount <= 0) {
        throw new Error("Amount must be greater than 0");
    }
    if (typeof amount !== 'number') {
        throw new Error("Amount must be a number");
    }
}

function convertToOctas(amount) {
    const amountInOctas = BigInt(Math.floor(amount * 100000000)).toString();
    const MAX_U64 = BigInt("18446744073709551615");
    
    if (BigInt(amountInOctas) > MAX_U64) {
        throw new Error("Amount exceeds maximum allowed value");
    }
    return amountInOctas;
}

function createTransactionPayload(amountInOctas) {
    return {
        type: "entry_function_payload",
        function: "0x1::coin::transfer",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [CONTRACT_ADDRESS, amountInOctas]
    };
}

async function submitTransactionWithRetry(payload, retryCount) {
    try {
        const transaction = await window.petra.signAndSubmitTransaction(payload);
        return transaction.hash;
    } catch (error) {
        if (retryCount < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return processPayment(amount, retryCount + 1);
        }
        throw error;
    }
}

async function monitorTransaction(txHash) {
    const startTime = Date.now();
    while (Date.now() - startTime < TX_TIMEOUT) {
        const status = await window.petra.getTransaction(txHash);
        if (status.success) return true;
        if (status.failed) throw new Error("Transaction failed");
        await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
    }
    throw new Error("Transaction timeout");
}

function handlePaymentError(error, retryCount) {
    updateUIState(UIState.ERROR);
    console.error("Payment failed:", error);
    if (retryCount >= MAX_RETRIES) {
        throw new Error(`Payment failed after ${MAX_RETRIES} retries: ${error.message}`);
    }
}

function updateUIState(state) {
    const payButton = document.getElementById("payButton");
    const loadingSpinner = document.getElementById("loadingSpinner");
    
    switch (state) {
        case UIState.LOADING:
            payButton.disabled = true;
            loadingSpinner.style.display = 'block';
            break;
        case UIState.SUCCESS:
            payButton.disabled = false;
            loadingSpinner.style.display = 'none';
            break;
        case UIState.ERROR:
            payButton.disabled = false;
            loadingSpinner.style.display = 'none';
            break;
        default:
            payButton.disabled = false;
            loadingSpinner.style.display = 'none';
    }
}

// Enhanced event listeners
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.petra === 'undefined') {
        const message = 'Petra wallet not found. Please install it to continue.';
        console.error(message);
        alert(message);
        return;
    }

    const connectWalletButton = document.getElementById("connectWalletButton");
    const payButton = document.getElementById("payButton");
    
    if (!connectWalletButton || !payButton) {
        console.error("Required buttons not found in DOM");
        return;
    }

    connectWalletButton.addEventListener("click", async () => {
        try {
            updateUIState(UIState.LOADING);
            await connectPetraWallet();
            updateUIState(UIState.SUCCESS);
        } catch (error) {
            updateUIState(UIState.ERROR);
            alert(`Failed to connect wallet: ${error.message}`);
        }
    });
    
    payButton.addEventListener("click", async () => {
        try {
            const amount = 0.1; // Replace with actual amount input
            const txHash = await processPayment(amount);
            alert(`Payment successful! Transaction: ${txHash}`);
        } catch (error) {
            alert(error.message);
        }
    });

    // Cleanup on page unload
    return () => {
        connectWalletButton.removeEventListener("click", connectPetraWallet);
        payButton.removeEventListener("click", () => {});
    };
});
