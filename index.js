const express = require('express')
const morgan = require('morgan')
const { json } = require('express')
//const { response } = require('express')
const app = express()


morgan.token('body', function (req, res) {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(
    ':method :url :status :res[content-length] - :response-time :body'))

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

    if (person) {
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
    if (!body.name) {
        return res.status(400).json({
            error: 'name is missing'
        })
    }
    if (!body.number) {
        return res.status(400).json({
            error: 'number is missing'
        })
    }
    if (persons.some(p => p.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    res.json(person)
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})