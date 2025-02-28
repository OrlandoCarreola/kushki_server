const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const KUSHKI_PRIVATE_KEY = process.env.KUSHKI_PRIVATE_KEY;

app.post("/charge", async (req, res) => {
    try {
        const { token, amount } = req.body;
        const response = await axios.post(
            "https://api.kushkipagos.com/card/v1/charges",
            {
                token,
                amount: { subtotalIva: 0, subtotalIva0: amount, iva: 0, ice: 0, currency: "USD" },
            },
            {
                headers: {
                    "Private-Merchant-Id": KUSHKI_PRIVATE_KEY,
                    "Content-Type": "application/json",
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(400).json({ error: error.response?.data || "Error processing payment" });
    }
});

app.listen(4000, () => console.log("Server running on port 4000"));
