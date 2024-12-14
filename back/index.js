// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;
const DATA_FILE = 'products.json';
const USERS_FILE = 'users.json';
const SECRET_KEY = 'your-secret-key';

app.use(bodyParser.json());

// Utility functions for products
const loadProducts = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

const saveProducts = (products) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
};

// Utility functions for users
const loadUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return [];
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
};

const saveUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Middleware to restrict admin actions
const isAdmin = (req, res, next) => {
    if (req.user.email !== 'admin@admin.com') {
        return res.status(403).json({ message: 'Forbidden: Admin only' });
    }
    next();
};

// Account creation
app.post('/account', async (req, res) => {
    const users = loadUsers();
    const { username, firstname, email, password } = req.body;

    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        username,
        firstname,
        email,
        password: hashedPassword
    };
    users.push(newUser);
    saveUsers(users);
    res.status(201).json({ message: 'Account created successfully' });
});

// User login
app.post('/token', async (req, res) => {
    const users = loadUsers();
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// API to create a new product (admin only)
app.post('/products', authenticateToken, isAdmin, (req, res) => {
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
app.get('/products', authenticateToken, (req, res) => {
    const products = loadProducts();
    res.json(products);
});

// API to retrieve details of a single product
app.get('/products/:id', authenticateToken, (req, res) => {
    const products = loadProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
});

// API to update details of an existing product (admin only)
app.patch('/products/:id', authenticateToken, isAdmin, (req, res) => {
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

// API to delete a product (admin only)
app.delete('/products/:id', authenticateToken, isAdmin, (req, res) => {
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
