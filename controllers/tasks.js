const express = require('express');
const router = express.Router();
const Task = require('../models/tasks.js');
// const jwt = require('jsonwebtoken')

//AUTH MIDDLEWARE
// const auth = async (req, res, next) => {
//     //example header => "Auhtorization":"bearer shfkj324jbkjbj234"
//     const {authorization} = req.headers //decon auth header
//     //check if header is present
//     if(authorization){
//         try{
//             const token = authorization.split(' ')[1]//parses token from header
//             const payload= jwt.verify(token, 'secret')
//             res.user = payload //puts user data into request object
//             next()//go to the route
//         }catch(error){
//             res.status(400).json(error)
//         }
//     }else{
//         res.status(400).send('NO AUTHORIZATION HEADER')
//     }
// }
///////////////////////


router.post('/', async (req, res) => {
    try {
        const createdTask = await Task.create(req.body);
        res.status(200).json(createdTask);
    } catch (error) {
        res.status(400).json(error);
    }
});


router.get('/',  async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json(error);
    }
});

router.delete('/:id',  async (req,res)=> {
    try{
        const deletedTask = await Task.findByIdAndDelete(req.params.id)
        res.status(200).json(deletedTask)
    }catch(error){
        res.status(400).json(error)
    }
})
///
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body
        );
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;