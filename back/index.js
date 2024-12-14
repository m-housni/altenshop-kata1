// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DATA_FILE = 'products.json';

app.use(bodyParser.json());

// Utility function to load products from JSON file
const loadProducts = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

// Utility function to save products to JSON file
const saveProducts = (products) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
};

// API to create a new product
app.post('/products', (req, res) => {
    const products = loadProducts();
    const newProduct = {
        ...req.body,
        id: products.length ? products[products.length - 1].id + 1 : 1,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    products.push(newProduct);
    saveProducts(products);
    res.status(201).json(newProduct);
});

// API to retrieve all products
app.get('/products', (req, res) => {
    const products = loadProducts();
    res.json(products);
});

// API to retrieve details of a single product
app.get('/products/:id', (req, res) => {
    const products = loadProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

// API to update details of an existing product
app.patch('/products/:id', (req, res) => {
    const products = loadProducts();
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });

    const updatedProduct = {
        ...products[productIndex],
        ...req.body,
        updatedAt: Date.now()
    };
    products[productIndex] = updatedProduct;
    saveProducts(products);
    res.json(updatedProduct);
});

// API to delete a product
app.delete('/products/:id', (req, res) => {
    const products = loadProducts();
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });

    products.splice(productIndex, 1);
    saveProducts(products);
    res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
