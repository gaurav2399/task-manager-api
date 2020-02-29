const {MongoClient,ObjectID} = require('mongodb')

const databaseName = 'task-manager'

const connectionUrl = 'mongodb://127.0.0.1:27017'

const id = new ObjectID()
console.log('time is ' + id.getTimestamp())
console.log(id)

MongoClient.connect(connectionUrl,{useUnifiedTopology: true},(error,client) => {
    if(error){
        return console.log('Some error in connection')
    }
    const db = client.db(databaseName)
    // db.collection('users').insertOne({
    //     _id: id,
    //     name: 'Pradyumn',
    //     age: 20
    // })
    // db.collection('users').find({
    //     age: 20
    // }).toArray((error,users) => {
    //     console.log(users)
    // })
    // db.collection('tasks').find({completed: false}).toArray((error,tasks) => {
    //     console.log(tasks)
    // })

    // db.collection('users').findOne({
    //     name: 'Gaurav'
    // },(error,result) => {
    //     console.log('Getting id is ' + result._id)
    // })
    // db.collection('users').insertMany([{
    //         name: 'Mayank',
    //         age: 20
    //     },{
    //         name: 'Mohit',
    //         age: 20
    //     }],(error,result) => {
    //         if(error){
    //             return console.log("ther is some error")
    //         }
    //         console.log(result.ops)
    //     })
    // db.collection('tasks').insertMany([{
    //         description: 'Prepare for HackWithInfy',
    //         completed: false
    //     },{
    //         description: 'Complete Node JS Course',
    //         completed: false
    //     },{
    //         description: 'Take internship for android',
    //         completed: true
    //     }],(error,result) => {
    //         if(error){
    //             return console.log('Cannot insert items')
    //         }
    //         console.log(result.ops)
    // })
    // db.collection('users').updateOne({
    //     name: 'Pradyumn'
    // },{
    //     $inc: {
    //         age: 1
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })
    // db.collection('tasks').updateMany({
    //     completed: false
    // },{
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })
    // db.collection('users').updateOne({
    //     name: 'Mohit'
    // },{
    //     $inc: {
    //         age: 1
    //     }
    // }).then(() => {
    //     console.log('Success!')
    // })
    // db.collection('users').deleteMany({
    //     age: 21
    // }).then(() => {
    //     console.log("Deleted.")
    // })
    db.collection('tasks').deleteOne({
        _id: new ObjectID("5e2f14329507539604b2dda5")
    }).then((result) => {
        console.log('deleted')
    })
})