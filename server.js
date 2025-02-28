const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post("/pay", async (req, res) => {
  try {
    const { token, amount } = req.body;

    const response = await axios.post(
      "https://api.kushkipagos.com/card/v1/charges",
      {
        token,
        amount: {
          subtotalIva: 0,
          subtotalIva0: amount,
          ice: 0,
          iva: 0,
          currency: "USD",
        },
      },
      {
        headers: {
          "Private-Merchant-Id": process.env.KUSHKI_PRIVATE_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.response?.data || "Error en el pago" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
