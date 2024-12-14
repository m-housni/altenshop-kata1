// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { createUser, loginUser } = require('./controllers/usersController');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('./controllers/productsController');
const { addToCart, getCart, removeFromCart } = require('./controllers/cartsController');
const { addToWishlist, getWishlist, removeFromWishlist } = require('./controllers/wishlistsController');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your-secret-key';

app.use(bodyParser.json());

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
app.post('/account', createUser);

// User login
app.post('/token', loginUser);

// API to manage products
app.get('/products', authenticateToken, getAllProducts);
app.get('/products/:id', authenticateToken, getProductById);
app.post('/products', authenticateToken, isAdmin, createProduct);
app.patch('/products/:id', authenticateToken, isAdmin, updateProduct);
app.delete('/products/:id', authenticateToken, isAdmin, deleteProduct);

// API to manage cart
app.post('/cart', authenticateToken, addToCart);
app.get('/cart', authenticateToken, getCart);
app.delete('/cart/:productId', authenticateToken, removeFromCart);

// API to manage wishlist
app.post('/wishlist', authenticateToken, addToWishlist);
app.get('/wishlist', authenticateToken, getWishlist);
app.delete('/wishlist/:productId', authenticateToken, removeFromWishlist);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
