const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;
const pairs = ['BTC-USDT', 'ATOM-USDT', 'KCS-USDT'];

const path = require('path');

// Serve static files from the 'style' directory
app.use('/style', express.static(path.join(__dirname, 'style')));


// Object to store delta, crypto price and processed transactions for each pair
const pairData = {
    'BTC-USDT': { delta: 0, cryptoPrice: 0, processedTransactions: new Set() },
    'ATOM-USDT': { delta: 0, cryptoPrice: 0, processedTransactions: new Set() },
    'KCS-USDT': { delta: 0, cryptoPrice: 0, processedTransactions: new Set() }
};

// Function to retrieve the history of transactions for a cryptocurrency pair from KuCoin API
async function getTransactions(cryptoPair) {
    try {
        const response = await axios.get(`https://api.kucoin.com/api/v1/market/histories?symbol=${cryptoPair}`);
        return response.data.data; // Return transactions data
    } catch (error) {
        console.error('Error while retrieving data', error);
        throw error;
    }
}

// Function to calculate delta for a specific pair
function calculateDelta(transactions, pair) {
    let { delta, cryptoPrice, processedTransactions } = pairData[pair];
    transactions.forEach(transaction => {
        if (!processedTransactions.has(transaction.sequence)) {
            if (transaction.side === 'buy') {
                delta += parseFloat(transaction.size);
            } else if (transaction.side === 'sell') {
                delta -= parseFloat(transaction.size);
            }
            cryptoPrice = transactions[0].price;
            processedTransactions.add(transaction.sequence);
        }
    });
    pairData[pair] = { delta, cryptoPrice, processedTransactions };
    return { delta, cryptoPrice };
}

// REST API endpoint to fetch the cumulative delta index for a specific trading pair
app.get("/api/cumulative-delta/:pair", async (req, res) => {
    const { pair } = req.params;
    
    const transactions = await getTransactions(pair);
    let { delta, cryptoPrice } = calculateDelta(transactions, pair);
    res.json({ cryptoPair: pair, delta, cryptoPrice });
});

// REST API endpoint to fetch the trades history for a specific trading pair
app.get("/api/trades/:pair", async (req, res) => {
    const { pair } = req.params;
    const transactions = await getTransactions(pair);
    res.json(transactions);
});

// REST API endpoint to fetch the cumulative delta for all pairs
app.get("/api/all-cumulative-delta", async (req, res) => {
    const allCumulativeDelta = {};
    for (const pair of pairs) {
        const transactions = await getTransactions(pair);
        const { delta, cryptoPrice } = calculateDelta(transactions, pair);
        allCumulativeDelta[pair] = { delta, cryptoPrice };
    }
    const jsonResponse = JSON.stringify(allCumulativeDelta);
    res.send(`<div id="json-response" class="json-response">${jsonResponse}</div>`);
});
// Handle HTTP requests
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Start the server
app.listen(port, () => {
    console.log(`Server launched on port: ${port}`);
});
