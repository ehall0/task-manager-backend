//Dependencies
const express =require('express')
const app =express()
const mongoose= require('mongoose')
const cors =require('cors');
// const jwt = require('jsonwebtoken')

//GLOBALS
const PORT  =process.env.PORT || 3002
const taskController =require('./controllers/tasks.js')
const db = mongoose.connection;
const MONGODB_URI =
    process.env.MONGODB_URL || 'mongodb://localhost:27017/tasks';

// //Dummy User
// const user = {username: 'emma', password: "password"}

//whitelist
const whitelist =['http://localhost:1985']
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

//DATABASE CONNECT
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
db.on('open', () => {
    console.log('Mongo is connected')
})
//MIDDLEWARE
app.use(cors())
app.use(express.json())
app.use('/tasks', taskController)

// //LOGIN ROUTE
// app.post ('/login', async (req,res)=> {
//     const {username, password}=req.body
//     //verify if the right username and password
//     if(username === user.username && password ==user.password){
//         const token = jwt.sign({username}, 'secret')
//         res.status(200).json(token)
//     }else{
//         res.status(400).send('WRONG USERNAME OR PASSWORD')
//     }
// })
//LISTENER
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})