import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { getUsers,
    getUserById,
    createUser,
    checkUserMdp,
    getLeads,
    getCollaborators,
    getNRP,
    getNRPCount,
    getManagerLeads,
    getUserLeads,
    updateLead,
    addLeadToCollab, 
    getLeadsDepartementCount,
    clearNRP,
    getUserByEmail} from './database.js'


// SETUP

const app = express() 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())


// REQUEST
app.get("/leads", async (req, res) => {
    const leads = await getLeads()
    res.status(200).send(leads)
})

app.get("/leads/clear", async (req, res) => {
    const leads = await clearNRP()
    res.status(200).send(leads)
})

app.post("/leads/:id", async (req, res) => {
    const id = req.params.id
    const { champ, value } = req.body
    const leads = await updateLead(id, champ, value)
    res.status(200).send(leads)
})

app.post("/leads/user/:id", async (req, res) => {
    const id = req.params.id
    const { region, len } = req.body
    const leads = await addLeadToCollab(id, region, len)
    res.status(200).send(leads)
})

app.get("/leads/manager/:id", async (req, res) => {
    const id = req.params.id
    const leads = await getManagerLeads(id)
    res.status(200).send(leads)
})

app.get("/leads/user/:id", async (req, res) => {
    const id = req.params.id
    const leads = await getUserLeads(id)
    res.status(200).send(leads)
})

app.get("/nrp", async (req, res) => {
    const leads = await getNRP()
    res.status(200).send(leads)
})

app.get("/nrp/count", async (req, res) => {
    const count = await getNRPCount()
    res.send(count)
})

app.post("/leads/departement/count", async (req, res) => {
    const { region } = req.body
    const count = await getLeadsDepartementCount(region)
    res.send(count)
})

app.get("/users", async (req, res) => {
    const users = await getUsers()
    res.status(200).send(users)
})

app.get("/collaborators/:id", async (req, res) => {
    const id = req.params.id
    const users = await getCollaborators(id)
    res.status(200).send(users)
})

app.get("/users/:id", async (req, res) => {
    const id = req.params.id
    const user = await getUserById(id)
    res.status(200).send(user)
})

app.post("/users/email", async (req, res) => {
    const { email } = req.body
    const user = await getUserByEmail(email)
    res.status(200).send(user)
})

app.post("/users", async (req, res) => {
    const { email, password, firstname, lastname, user_type, manager_id } = req.body
    const user = await createUser(email, password, firstname, lastname, user_type, manager_id)
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