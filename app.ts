const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;
let cryptoPair = 'BTC-USDT';
let processedTransactions = new Set();

// Serve static files from the 'style' directory
app.use('/style', express.static(__dirname + '/style'));

// Function to retrieve the history of transactions for a cryptocurrency pair
async function getTransactions(cryptoPair) {
    try {
        const response = await axios.get(`https://api.kucoin.com/api/v1/market/histories?symbol=${cryptoPair}`);
        return response.data.data; // Return transactions data
    } catch (error) {
        console.error('Error while retrieving data', error);
        throw error;
    }
}

// REST API endpoint to fetch the cumulative delta index for a specific trading pair
app.get("/api/cumulative-delta/:pair", async (req, res) => {
    const { pair } = req.params;
    let delta = 0;
    let cryptoPrice = 0;
    const transactions = await getTransactions(pair);
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
    res.json({ cryptoPair: pair, delta, cryptoPrice });
});

// REST API endpoint to fetch the trades history for a specific trading pair
app.get("/api/trades/:pair", async (req, res) => {
    const { pair } = req.params;
    const transactions = await getTransactions(pair);
    res.json(transactions);
});

// Handle HTTP requests
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Start the server
app.listen(port, () => {
    console.log(`Server launched on port: ${port}`);
});
