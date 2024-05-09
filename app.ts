const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

// Function retrieving the history of the last 100 transactions of a cryptocurrency pair
async function getTransactions(cryptoPair) {
    try {
        const response = await axios.get(`https://api.kucoin.com/api/v1/market/histories?symbol=${cryptoPair}`);
        return response.data.data; // return transactions data
    } catch (error) {
        console.error('Error while retrieving data', error);
        throw error;
    }
}
app.get('/', async (req, res) => {

    // Retrieve transaction data for the given pair (ex: BTC-USDT)
    const cryptoPair = 'BTC-USDT';
    const transactions = await getTransactions(cryptoPair);
    
    // Filter and map transactions to only include 'sequence' and 'side'
    const filteredTransactions = transactions.map(transaction => {
        return {
            sequence: transaction.sequence,
            side: transaction.side
        };
    });
    
    // Return filtered transactions using JSON
    res.json(filteredTransactions);
});

app.listen(port, () => {
    console.log(`Server launched on port: ${port}`);
});
