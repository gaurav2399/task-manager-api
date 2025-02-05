const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/tasks',auth,async (req,res) => {
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(201).send(req.user.tasks)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/tasks/:id',auth,async (req,res) => {
    try{
        const _id = req.params.id
        const task = await Task.findOne({_id,owner: req.user._id})
        if(!task)
            return res.status(400).send('Task not found')
        res.status(201).send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/tasks',auth,async (req,res) => {
    try{
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.status(200).send(task)
    }catch(e){
        res.status(400).send('Cannot added task!')
    }
})

router.patch('/tasks/:id',auth,async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description","completed"]
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidUpdate)
        return res.status(400).send({error: "not valid update"})
    
    try{
        const id = req.params.id
        const task = await Task.findOne({_id: id,owner: req.user._id})
        if(!task)
            return res.status(404).send()
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id',auth,async (req, res) => {
    try{
        const task = await Task.findByIdAndDelete({_id: req.params.id,owner: req.user._id})
        if(!task)
            return res.status(404).send()
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router