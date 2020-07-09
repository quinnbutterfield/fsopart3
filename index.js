const express = require('express')
const { response } = require('express')
const app = express()

app.use(express.json())

let persons = [

    {
        name: "tommy",
        number: "edison",
        id: 2
    },
    {
        name: "ear doughball",
        number: "",
        id: 3
    },
    {
        name: "Ready Frederico",
        number: "99",
        id: 4
    }

]

//Show overview
app.get('/info', (req, res) => {
    res.send(
        `<div>Phonebook has info for ${persons.length} people</div>
        <div>${new Date()}</div>`
    )
})

//Get all people in phonebook
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

//Get an individual entry
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    
    if(person){
        res.json(person)
    } else {
        res.status(404).end()
    }
})

//Delete a person
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * Math.floor(100000))
}

//Add a person
app.post('/api/persons', (req, res) => {
    const body = req.body
    if(!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})