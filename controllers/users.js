// dependencies
const express = require('express');
const users = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users.js');
const jwt = require('jsonwebtoken');
const checkAuth = require('./checkAuth.js');
const {
    SECRET = 'sjkfbsjdfbskjdbfkjd'
} = process.env

//////////////////////////
// New User Authentication
//////////////////////////

users.post('/', (req, res) => {
    // destructure username and password out of request
    const { username, password, isAdmin } = req.body;
    // make sure both fields were entered
    if (!username || !password) {
        return res.status(400).json({ message: 'Please enter a Username and Password' });
    }
    // check for password length requirement
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    // Check password for at least one of each:
    // - Uppercase Letter
    // - Lowercase Letter
    // - number
    // - special character
    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/g)) {
        return res.status(400).json({ message: 'Password does not meet the requirements' })
    }
    // check if username already exists
    User.findOne({ username })
        .then(user => {
            if (user) return res.status(400).json({ message: 'Username already exists' });
            // if not, create new User object
            const newUser = new User({
                username,
                password,
                isAdmin
            });
            // encrypt new user password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
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
                                        token,
                                        user: {
                                            _id: user._id,
                                            username: user.username,
                                            isAdmin: user.isAdmin
                                        }
                                    })    
                                },
                            )
                        })
                })
            } )
            // add user to the database
            User.create(newUser)
        })
});


// GET my jobs
users.get('/cart/:id', (req, res) => {
    console.log(req.params)
    const userId = req.params.id
    if (userId !== 'undefined') {
        User.findById(userId, (err, docs) => {
            if (err) console.log(err)
            const cart = docs.cart;
            console.log(cart)
            res.status(200).json(cart)
        })
    }
})


// Add to MyJobs
users.post('/addToCart', (req, res) => {
    const { userId, group } = req.body;
    const {
        _id,
        name,
        description,
        deadline,
        signedup,
        status
        
        
    } = group;
    
    User.findByIdAndUpdate(userId, 
        { $push: { cart: [{ _id, name, description, deadline,status, signedup}]}}, { new: true }, (err, doc) => {
        if (err) console.log(err)
        console.log(status)
       
    })
    
})

// delete from my jobs
users.delete('/:id/:group', async (req, res) => {
    console.log('got delete')
    const { id, group } = req.params;
    if (id !== 'undefined') {
        User.findById(id, (err, docs) => {
            if (err) console.log(err)
            const newCart = docs.cart;
            let hasRemoved = false;
            newCart.forEach((item, index) => {
                if (hasRemoved === false && item._id === group) {
                    newCart.splice(index, 1);
                    return hasRemoved = true
                }
            })
            User.findByIdAndUpdate(id, { $set: { cart: [...newCart]}}, { new: true}, (err, docs) => {
                if (err) console.log(err)
                console.log(docs)
            })
            res.status(200).json(newCart)
        })
    }
})

module.exports = users;