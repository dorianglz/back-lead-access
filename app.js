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
    getManagerLeadsCount,
    getUserLeads,
    getUserLeadsCount,
    updateLead,
    addLeadToCollab, 
    getLeadsDepartementCount,
    clearNRP,
    getUserByEmail,
    getManagerLeadsCountNotAssigned,
    getAllStatusCount,
    getAllStatusCountUser
} from './database.js'


// SETUP

const app = express() 

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Mettez ici votre domaine autorisé
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // Si la requête est une OPTIONS, renvoyez une réponse immédiate avec un statut 200
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    next();
});  

// REQUEST
app.get("/leads", async (req, res) => {
    const leads = await getLeads()
    res.status(200).send(leads)
})

app.get("/leads/clear/:id", async (req, res) => {
    const id = req.params.id
    const leads = await clearNRP(id)
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

app.post("/leads/manager/:id", async (req, res) => {
    const id = req.params.id
    const { search, limit, offset } = req.body

    const leads = await getManagerLeads(id, search, limit, offset)
    res.status(200).send(leads)
})

app.get("/leads/manager/count/:id", async (req, res) => {
    const id = req.params.id
    const leads = await getManagerLeadsCount(id)
    res.status(200).send(leads)
})

app.get("/leads/manager/count/notassigned/:id", async (req, res) => {
    const id = req.params.id
    const leads = await getManagerLeadsCountNotAssigned(id)
    res.status(200).send(leads)
})

app.post("/leads/users/:id", async (req, res) => {
    const id = req.params.id
    const { search, limit, offset } = req.body

    const leads = await getUserLeads(id, search, limit, offset)
    res.status(200).send(leads)
})

app.get("/leads/user/count/:id", async (req, res) => {
    const id = req.params.id
    const leads = await getUserLeadsCount(id)
    res.status(200).send(leads)
})

app.get("/nrp", async (req, res) => {
    const leads = await getNRP()
    res.status(200).send(leads)
})

app.post("/all/count/manager/:id", async (req, res) => {
    const id = req.params.id
    const counts = await getAllStatusCount(id)
    res.send(counts)
})

app.post("/all/count/user/:id", async (req, res) => {
    const id = req.params.id
    const counts = await getAllStatusCountUser(id)
    res.send(counts)
})

app.get("/nrp/count/:id", async (req, res) => {
    const id = req.params.id
    const count = await getNRPCount(id)
    res.send(count)
})

app.post("/leads/departement/count", async (req, res) => {
    const { region, id } = req.body
    const count = await getLeadsDepartementCount(region, id)
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

app.listen(8800, () => {
    console.log('Server running port 8800')
})