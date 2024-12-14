const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const USERS_FILE = 'db/users.json';
const SECRET_KEY = 'your-secret-key';

const loadUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return [];
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
};

const saveUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const createUser = async (req, res) => {
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
};

const loginUser = async (req, res) => {
    const users = loadUsers();
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
};

module.exports = {
    createUser,
    loginUser
};
