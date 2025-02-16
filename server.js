require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

// Configurar o servidor
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Variáveis de ambiente
const ownerPassword = process.env.OWNER_PASSWORD || '12345'; // Senha padrão
const whatsappNumber = process.env.WHATSAPP_NUMBER || '5585991941046'; // Número padrão

// Rota para autenticar o dono
app.post('/api/authenticate', (req, res) => {
    const { password } = req.body;
    if (password === ownerPassword) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Senha incorreta!' });
    }
});

// Rota para obter o número do WhatsApp
app.get('/api/whatsapp', (req, res) => {
    res.json({ whatsappNumber });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
