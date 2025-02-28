const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.post('/pay', async (req, res) => {
    try {
        const { token } = req.body;
        const response = await fetch('https://api-uat.kushkipagos.com/card/v1/charges', {
            method: 'POST',
            headers: {
                'Private-Merchant-Id': process.env.7ffc67b5640948c1842cd33739d281b9, //cambio reciente de id
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token,
                amount: { subtotalIva: 10, iva: 0, subtotalIva0: 0, ice: 0, currency: "USD" },
                metadata: {}
            })
        });
        const result = await response.json();
        res.json({ message: result.approved ? 'Pago exitoso' : 'Pago declinado' });
    } catch (error) {
        res.status(500).json({ message: 'Error procesando el pago' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
