const fs = require('fs');
const DATA_FILE = 'db/products.json';

const loadProducts = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

const saveProducts = (products) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
};

const getAllProducts = (req, res) => {
    const products = loadProducts();
    res.json(products);
};

const getProductById = (req, res) => {
    const products = loadProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
};

const createProduct = (req, res) => {
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
};

const updateProduct = (req, res) => {
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
};

const deleteProduct = (req, res) => {
    const products = loadProducts();
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });

    products.splice(productIndex, 1);
    saveProducts(products);
    res.status(204).send();
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
