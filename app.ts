const express = require("express");
const app = express();
const port = 3000;
app.get('/', (req, res) => {
    res.json("Delta : 24 (exemple statique)")
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});

