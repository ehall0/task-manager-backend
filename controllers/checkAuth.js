const jwt = require('jsonwebtoken');

const {
    SECRET = 'sjkfbsjdfbskjdbfkjd'
} = process.env

const checkAuth = (req, res, next) => {
    const token = req.header('x-auth-token');
    try {
        if (!token) {
            res.status(401).json({ msg: 'Not authorized' })
        } else {
            const decoded = jwt.verify(token, SECRET)
        }
        req.user = decoded._id;
        next();
    } catch(err) {
        res.status(400).json({ msg: 'Token is not valid' })
    }
}

module.exports = checkAuth;