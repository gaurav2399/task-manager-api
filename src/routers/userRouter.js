const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()

router.get('/users/me', auth, async (req,res) => {
    return res.send(req.user)
})

 router.get('/users/:id',async (req,res) => {

    try{
        const _id = req.params.id
        console.log(req.params)
        const user = await User.findById(_id)
        if(!user)
            return res.status(400).send('user not found')
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }

})

router.post('/users',async (req,res) => {
    try{
        console.log(req.body)
        const user = new User(req.body)
        console.log(user)
        await user.save()
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        if(!user)
            return res.status(404).send()
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send(e.toString())
    }
})

router.post('/users/logout' ,auth ,async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return (token.token != req.token)
        })
        await req.user.save()
        res.status(200).send({"logout": "done"}) 
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send('Logout all sessions')
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    console.log(updates)
    const allowedUpdates = ["name","email","password","age"]
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    console.log(isValidUpdate)

    if(!isValidUpdate)
        return res.status(400).send({error: "invalid update!"})
    try{
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})
const avatar = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        // regular expression use
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/))
            return cb(new Error('File must be image'))
        cb(undefined,true)
    }
})
router.post('/users/me/avatar',auth,avatar.single('avatar'),async(req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).jpeg().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next) => {
    res.status(400).send({error: error.message})
})

router.delete('users/me/avatar',auth,async (req,res) => {
    try{
    req.user.avatar = {}
    await req.user.save()
    res.status(200),send()
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try{
        req.user.avatar = undefined
        req.user.save()
        res.send()  
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/users/:id/avatar',async (req,res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar)
            throw new Error()
        res.set('Content-type','image/jpeg')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send(e)
    }
})

module.exports = router