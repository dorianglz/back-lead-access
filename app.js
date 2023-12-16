import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { getUsers, getUserById, createUser, checkUserMdp, getLeads } from './database.js'


// SETUP

const app = express() 

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors())


// REQUEST
app.get("/leads", async (req, res) => {
    const leads = await getLeads()
    res.send(leads)
})

app.get("/users", async (req, res) => {
    const users = await getUsers()
    res.send(users)
})

app.get("/users/:id", async (req, res) => {
    const id = req.params.id
    const user = await getUserById(id)
    res.send(user)
})

app.post("/users", async (req, res) => {
    const { email, password, firstname, lastname, user_type, manager } = req.body
    const user = await createUser(email, password, firstname, lastname, user_type, manager)
    res.status(201).send(user)
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body
    const user = await checkUserMdp(email, password)
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