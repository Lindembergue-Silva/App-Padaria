 // Configurações do sistema (senha e WhatsApp) ofuscados com base64
 const SYSTEM_CONFIG = (() => {
    const encryptedPassword = 'MTIzNDU='; // ps
    const whatsappNumber = 'NTU4NTkxOTQxMDQ2'; //zp

    return {
        getPassword: () => atob(encryptedPassword),
        getWhatsappNumber: () => atob(whatsappNumber),
    };
})();

// Armazenamento de produtos
const products = JSON.parse(localStorage.getItem('products')) || [];
let editIndex = null;
const selectedProducts = [];

// Renderizar produtos
function renderProducts() {
    const adminProductContainer = document.getElementById('adminProducts');
    const clientProductContainer = document.getElementById('products');
    adminProductContainer.innerHTML = '';
    clientProductContainer.innerHTML = '';

    products.forEach((product, index) => {
        const productHTML = `
            <div class="card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Preço: R$ ${product.price.toFixed(2)}</p>
                ${
                    document.getElementById('adminSection').style.display === 'block'
                        ? `
                            <button onclick="editProduct(${index})">Editar</button>
                            <button onclick="deleteProduct(${index})">Excluir</button>
                          `
                        : `<button onclick="selectProduct(${index})">Selecionar</button>`
                }
            </div>
        `;
        if (document.getElementById('adminSection').style.display === 'block') {
            adminProductContainer.innerHTML += productHTML;
        } else {
            clientProductContainer.innerHTML += productHTML;
        }
    });
}

// Função para autenticar o dono
// Função para autenticar o dono
function accessAdmin() {
const password = prompt('Digite a senha de acesso:');
if (password === SYSTEM_CONFIG.getPassword()) {
document.getElementById('loginSection').style.display = 'none';
document.getElementById('adminSection').style.display = 'block';
document.title = 'Padaria App'; // Título para o dono
renderProducts();
} else {
alert('Senha incorreta!');
}
}

// Função para acessar como cliente
function accessClient() {
document.getElementById('loginSection').style.display = 'none';
document.getElementById('clientSection').style.display = 'block';
document.title = 'Cardápio'; // Título para o cliente
renderProducts();
}


// Adicionar ou editar produto
function addOrUpdateProduct() {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const image = document.getElementById('productImage').value;

    if (!name || isNaN(price) || !image) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    if (editIndex !== null) {
        products[editIndex] = { name, price, image };
        editIndex = null;
    } else {
        products.push({ name, price, image });
    }

    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productImage').value = '';
}

// Editar produto
function editProduct(index) {
    const product = products[index];
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productImage').value = product.image;
    editIndex = index;
}

// Excluir produto
function deleteProduct(index) {
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
}

// Selecionar produto
function selectProduct(index) {
    const product = products[index];
    selectedProducts.push(product);
    const total = selectedProducts.reduce((sum, product) => sum + product.price, 0);
    document.getElementById('orderTotal').textContent = total.toFixed(2);
}

// Fazer pedido via WhatsApp
function makeOrder() {
    const clientName = document.getElementById('clientName').value;
    const clientAddress = document.getElementById('clientAddress').value;

    if (!clientName || !clientAddress) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    if (selectedProducts.length === 0) {
        alert('Por favor, selecione pelo menos um produto!');
        return;
    }

    let message = `Olá, gostaria de fazer um pedido:\n\n`;
    selectedProducts.forEach(product => {
        message += `- ${product.name}: R$ ${product.price.toFixed(2)}\n`;
    });
    message += `\nTotal: R$ ${selectedProducts.reduce((sum, product) => sum + product.price, 0).toFixed(2)}`;
    message += `\n\nNome: ${clientName}\nEndereço: ${clientAddress}`;

    const whatsappLink = `https://wa.me/${SYSTEM_CONFIG.getWhatsappNumber()}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
}

// Exibir tela de login ao carregar
document.getElementById('loginSection').style.display = 'block';