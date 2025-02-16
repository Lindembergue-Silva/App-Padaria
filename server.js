require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

// Configurar o servidor
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Simulando um "banco de dados" em memória
let products = [];

// Rota para autenticar o dono
app.post('/api/authenticate', (req, res) => {
    const { password } = req.body;
    const ownerPassword = process.env.OWNER_PASSWORD || '12345'; // Senha padrão
    if (password === ownerPassword) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Senha incorreta!' });
    }
});

// Rota para obter o número do WhatsApp
app.get('/api/whatsapp', (req, res) => {
    const whatsappNumber = process.env.WHATSAPP_NUMBER || '5585991941046'; // Número padrão
    res.json({ whatsappNumber });
});

// Rota para obter todos os produtos
app.get('/api/products', (req, res) => {
    res.json({ success: true, products });
});

// Rota para adicionar ou atualizar um produto
app.post('/api/products', (req, res) => {
    const { name, price, image } = req.body;
    if (!name || !price || !image) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios!' });
    }
    const newProduct = { id: products.length + 1, name, price: parseFloat(price), image };
    products.push(newProduct);
    res.json({ success: true, product: newProduct });
});

// Rota para editar um produto
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, image } = req.body;
    const productIndex = products.findIndex((product) => product.id === parseInt(id));
    if (productIndex === -1) {
        return res.status(404).json({ success: false, message: 'Produto não encontrado!' });
    }
    products[productIndex] = { ...products[productIndex], name, price: parseFloat(price), image };
    res.json({ success: true, product: products[productIndex] });
});

// Rota para excluir um produto
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const productIndex = products.findIndex((product) => product.id === parseInt(id));
    if (productIndex === -1) {
        return res.status(404).json({ success: false, message: 'Produto não encontrado!' });
    }
    products.splice(productIndex, 1);
    res.json({ success: true });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
