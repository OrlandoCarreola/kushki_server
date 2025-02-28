import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/charge', async (req, res) => {
    const { token, amount } = req.body;
    
    try {
        const response = await fetch('https://api.kushkipagos.com/card/v1/charges', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Private-Merchant-Id': process.env.PRIVATE_MERCHANT_ID, // Usar variable de entorno
            },
            body: JSON.stringify({
                token,
                amount: { subtotalIva: amount, iva: 0, subtotalIva0: 0, ice: 0, totalAmount: amount },
                currency: 'USD',
            }),
        });

        const result = await response.json();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error procesando el pago', error });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));