const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.post('/pay', async (req, res) => {
    try {
        console.log("Datos recibidos en /pay:", req.body);
        const { token } = req.body;
        
        if (!token) {
            console.error("Token no recibido o inválido");
            return res.status(400).json({ message: "Token no recibido o inválido" });
        }

        console.log("Enviando a Kushki:", JSON.stringify({
            token,
            amount: { subtotalIva: 16.98, iva: 0, subtotalIva0: 0, ice: 0, currency: "MXN" },
            metadata: {}
        }, null, 2));

        const response = await fetch('https://api-uat.kushkipagos.com/card/v1/charges', {
            method: 'POST',
            headers: {
                'Private-Merchant-Id': process.env.PRIVATE_MERCHANT_ID,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token,
                amount: { subtotalIva: 16.98, iva: 0, subtotalIva0: 0, ice: 0, currency: "MXN" },
                metadata: {}
            })
        });

        const result = await response.json();
        console.log("Respuesta de Kushki API:", result);
        res.json({ message: result.approved ? 'Pago exitoso' : `Pago declinado: ${result.message}` });
    } catch (error) {
        console.error("Error procesando el pago:", error);
        res.status(500).json({ message: 'Error procesando el pago' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
