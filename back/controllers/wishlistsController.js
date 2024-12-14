const fs = require('fs');
const WISHLISTS_FILE = 'db/wishlists.json';

const loadWishlists = () => {
    if (!fs.existsSync(WISHLISTS_FILE)) return {};
    const data = fs.readFileSync(WISHLISTS_FILE);
    const wishlists = JSON.parse(data);
    return wishlists;
};

const saveWishlists = (wishlists) => {
    fs.writeFileSync(WISHLISTS_FILE, JSON.stringify(wishlists, null, 2));
};

const addToWishlist = (req, res) => {
    const wishlists = loadWishlists();
    const userWishlist = wishlists[req.user.id] || [];

    const { productId } = req.body;
    if (!userWishlist.includes(productId)) {
        userWishlist.push(productId);
    }

    wishlists[req.user.id] = userWishlist;
    saveWishlists(wishlists);
    res.status(200).json(userWishlist);
};

const getWishlist = (req, res) => {
    const wishlists = loadWishlists();
    res.json(wishlists[req.user.id] || []);
};

const removeFromWishlist = (req, res) => {
    const wishlists = loadWishlists();
    const userWishlist = wishlists[req.user.id] || [];

    wishlists[req.user.id] = userWishlist.filter(id => id !== parseInt(req.params.productId));
    saveWishlists(wishlists);
    res.status(204).send();
};

module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
};
