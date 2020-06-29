const {Schema, model} = require('mongoose')

const taskSchema = new Schema({
    groupName: { type: String },
    members: [{ type: String }],
    description: { type: String },
}) 

const Task = model('task', taskSchema)

module.exports =model('Task', taskSchema)