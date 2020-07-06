const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: String },
    cart: { type: Array, default: [] },
}, { timestamps: true })

module.exports = User = model('user', userSchema);
