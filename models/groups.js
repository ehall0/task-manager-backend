const { model, Schema } = require('mongoose');

//////////////////////////
// Product Schema
//////////////////////////

const groupSchema = new Schema({
    name: { 
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    deadline: { 
        type: String, 
        required: true, 
    },
    signedup: { 
        type: String,  
    }
}, { timestamps: true })

module.exports = Group = model('group', groupSchema);


