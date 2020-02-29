const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')

const port = process.env.PORT
const app = express()

app.use(express.json())

app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log("Start lsitening on port " + port)
})
