//////////////////
// Dependencies
/////////////////
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const groupsController = require('./controllers/routes.js');
const usersController = require('./controllers/users.js');
const authController = require('./controllers/auth.js');

////////////////////
// Global Variables
///////////////////
const PORT = process.env.PORT || 3001;

const db= mongoose.connection
const MONGODB_URI = process.env.MONGODB_URL || 'mongodb://localhost:27017/groups'

////////////////////
// db connection
///////////////////
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
db.once('open', () => console.log('connected to mongo at', MONGODB_URI));
db.on('error', (err) => console.log('🚨🚨🚨', err));

/////////////////////
// CORS
////////////////////

const whitelist = [
    'http://localhost:3000',

]
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
 };
    

// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use('/groups', groupsController);
app.use('/users', usersController);
app.use('/auth', authController); 

// listen
/////////////
app.listen(PORT, () => console.log('listening on', PORT));