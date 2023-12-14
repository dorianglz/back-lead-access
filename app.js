import express from 'express'
import bodyParser from 'body-parser'

import { getUsers, getUser, createUser } from './database.js'


// SETUP

const app = express() 

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// REQUEST

app.get("/users", async (req, res) => {
    const users = await getUsers()
    res.send(users)
})

app.get("/users/:id", async (req, res) => {
    const id = req.params.id
    const user = await getUser(id)
    res.send(user)
})

app.post("/users", async (req, res) => {
    const { email, firstname, lastname, user_type, manager } = req.body
    const user = await createUser(email, firstname, lastname, user_type, manager)
    res.status(201).send(user)
})


// ERROR HANDLER

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})


// LISTENNER

app.listen(8080, () => {
    console.log('Server running port 8080')
})