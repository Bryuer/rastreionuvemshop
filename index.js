const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Substitua pelos seus tokens da Nuvemshop e Dropi
const NUVE_SHOP_TOKEN = 'SEU_TOKEN_DE_API_NUVEMSHOP';
const DROPI_TOKEN = 'SEU_TOKEN_DE_API_DROPI';

app.use(express.json());

app.get('/rastrear/:numeroPedido', async (req, res) => {
    const numeroPedido = req.params.numeroPedido;

    try {
        // Chamada para a API da Nuvemshop para obter detalhes do pedido
        const respostaPedido = await axios.get(`https://api.nuvemshop.com.br/v1/orders/${numeroPedido}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${NUVE_SHOP_TOKEN}`
            }
        });

        const dadosPedido = respostaPedido.data;
        const codigoRastreamento = dadosPedido.shipping_tracking_code;

        // Chamada para a API do Dropi para obter informações de rastreamento
        const respostaRastreamento = await axios.get(`https://api.dropi.com.br/v1/tracking/${codigoRastreamento}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DROPI_TOKEN}`
            }
        });

        const dadosRastreamento = respostaRastreamento.data;

        // Retorna os dados de rastreamento
        res.json({
            status: dadosRastreamento.status,
            last_update: dadosRastreamento.last_update,
            location: dadosRastreamento.location
        });
    } catch (error) {
        console.error('Erro ao rastrear pedido:', error);
        res.status(500).json({ error: 'Erro ao rastrear pedido' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
