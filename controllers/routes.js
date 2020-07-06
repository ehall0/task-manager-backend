const express = require('express');
const router = express.Router();
const Group = require('../models/groups');
const User = require('../models/users.js')
////////////////// 
// Index Route
//////////////////
router.get('/', async (req, res) => {
   try {
       const allGroups = await Group.find({});
       res.status(200).json(allGroups);
   } catch (error) {
       res.status(400).json(error);
   }
});
////////////////// 
// Index Route for users
//////////////////
router.get('/assignedjobs', async (req, res) => {
    try {
        const allGroups = await Group.find({});
        res.status(200).json(allGroups);
    } catch (error) {
        res.status(400).json(error);
    }
 });
 
//////////////////
// New Route
//////////////////
router.post('/', async (req, res) => {
   try {
       const newGroup = await Group.create(req.body);
       res.status(200).json(newGroup);
   } catch (error) {
       res.status(400).json(error);
   }
});

//////////////////
// Delete Route
//////////////////
router.delete('/:id', async (req, res) => {
   try {
       const deletedGroup = await Group.findByIdAndRemove(req.params.id);
       res.status(200).json(deletedGroup);
   } catch (error) {
       res.status(400).json(error);
   }
});

//////////////////
// Edit Route
//////////////////
router.put('/:id', async (req, res) => {
   try {
       const updatedGroup = await Group.findByIdAndUpdate(
           req.params.id,
           req.body,
           { new: true }
       );
       res.status(200).json(updatedGroup);
   } catch (error) {
       res.status(400).json(error);
   }
});

module.exports = router;