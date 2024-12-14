const fs = require('fs');
const CARTS_FILE = 'db/carts.json';

const loadCarts = () => {
    if (!fs.existsSync(CARTS_FILE)) return {};
    const data = fs.readFileSync(CARTS_FILE);
    const carts = JSON.parse(data);
    console.log("loadCarts", carts);
    return carts;
};

const saveCarts = (carts) => {
    console.log("saveCarts", carts);
    fs.writeFileSync(CARTS_FILE, JSON.stringify(carts, null, 2));
};

const addToCart = (req, res) => {
    const carts = loadCarts();
    const userCart = carts[req.user.id] || [];

    const { productId, quantity } = req.body;
    const existingItem = userCart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        userCart.push({ productId, quantity });
    }

    carts[req.user.id] = userCart;
    saveCarts(carts);
    res.status(200).json(userCart);
};

const getCart = (req, res) => {
    const carts = loadCarts();
    res.json(carts[req.user.id] || []);
};

const removeFromCart = (req, res) => {
    const carts = loadCarts();
    const userCart = carts[req.user.id] || [];

    carts[req.user.id] = userCart.filter(item => item.productId !== parseInt(req.params.productId));
    saveCarts(carts);
    res.status(204).send();
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart
};
