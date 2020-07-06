// dependencies
const express = require('express');
const auth = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users.js');
const jwt = require('jsonwebtoken');
const checkAuth = require('./checkAuth.js');
const {
    SECRET = 'sjkfbsjdfbskjdbfkjd'
} = process.env

//////////////////////////
// Login Authentication
//////////////////////////

auth.post('/', (req, res) => {

    // destructure username and password out of request
    const { username, password } = req.body;
    // make sure both fields were entered
    if (!username || !password) {
        return res.status(400).json({ message: 'Please enter a Username and Password' });
    }

    // check if username is valid
    User.findOne({ username })
    .then(user => {
        if (!user) return res.status(400).json({ message: 'Username and/or Password is invalid' });
            
        // validate password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (!isMatch) return res.status(400).json({ message: 'Username and/or Password is invalid' });
                // sign jasonwebtoken
                jwt.sign(
                    // Payload (json object)
                    { _id: user._id },
                    // Secret
                    SECRET,
                    // Expiration object
                    // - optional - this is set to 1 hour:
                    { expiresIn: 1000 * 60 * 60 * 1 },
                    // Callback
                    (err, token) => {
                        if(err) throw err;
                        res.json({
                            token: token,
                            user: {
                                _id: user._id,
                                username: user.username,
                                isAdmin:user.isAdmin
                            }
                        })
                    },
                )
            })
        })
});

auth.post('/validateToken', async (req, res) => {
    try {
        const token = req.headers['x-auth-token'];
        if (!token) return res.json(false);
        const verified = jwt.verify(token, SECRET);
        if (!verified) return res.json(false);

        const user = await User.findById(verified._id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

auth.get('/', async (req, res) => {
    const token = req.headers['x-auth-token']
    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded);
    res.json({
        _id: user._id,
        username: user.username,
        isAdmin:user.isAdmin,
        cart: user.cart,
    });
})




module.exports = auth;