const express = require("express");
const axios = require("axios");
const webSocket = require("ws"); // webSocket and not WebSocket because of a conflict with the library from TypeScript
const app = express();
const server = require("http").createServer(app);
const wss = new webSocket.Server({ server });
const port = 3000;

// Ensemble pour stocker les ID des transactions déjà traitées
const processedTransactions = new Set();
let delta = 0;
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

// WebSocket connection handler
wss.on("connection", (ws) => {
    console.log("Client connected");
    
    // Send initial delta value to client
    ws.send(JSON.stringify({ delta: "Waiting for" }));
    // Periodically update delta and send it to client
    setInterval(async () => {
        
        const cryptoPair = 'BTC-USDT';
        const transactions = await getTransactions(cryptoPair);
        const filteredTransactions = transactions.map(transaction => {
            return {
                sequence: transaction.sequence,
                side: transaction.side,
                size: parseFloat(transaction.size), //transaction.size is a "String" and we need a Float.
            };
        });
    
        transactions.forEach(transaction => {
            if (!processedTransactions.has(transaction.sequence)) {
                if (transaction.side === 'buy') {
                    delta += parseFloat(transaction.size);
                } else if (transaction.side === 'sell') {
                    delta -= parseFloat(transaction.size);
                }
                processedTransactions.add(transaction.sequence);
                console.log("has been added")
            }
        });
        console.log("_____________________________________________________________")
        ws.send(JSON.stringify({ filteredTransactions ,delta }));
    }, 3000); // Update delta every 20 seconds
});

// HTTP route handler
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

server.listen(port, () => {
    console.log(`Server launched on port: ${port}`);
});
