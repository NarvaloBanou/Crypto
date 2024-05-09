const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

//test (print static exemple in localhost://3000)
app.get('/', (req, res) => {
    res.json("Delta : 24")
});

// Function retrieving the history of the last 100 transactions of a cryptocurrency pair
async function getTransactions(cryptoPair) {
    try {
        const response = await axios.get(`https://api.kucoin.com/api/v1/market/histories?symbol=${cryptoPair}`);
        return response.data.data; // return transaction data
    } catch (error) {
        console.error('Error while retrieving data', error);
        throw error;
    }
}
//using getTransactions to print all data in the console
getTransactions('BTC-USDT')
.then((transactions) => {
    console.log('KuCoin transactions for the pair BTC-USDT :', transactions);
    // Display all the data in the console
})

app.listen(port, () => {
    console.log(`Server launched on port: ${port}`);
});

