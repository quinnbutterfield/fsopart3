require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const { response } = require('express')


const errorHandler = (error, reqeust, response, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformatted id'
        })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error : error.message})
    }
    console.log('error is ', error.name)
    next(error)
}

morgan.token('body', function (req, res) {
    return JSON.stringify(req.body)
})


app.use(express.json())
app.use(express.static('build'))
app.use(morgan(
    ':method :url :status :res[content-length] - :response-time :body'))
app.use(cors())
let persons = []



//Show overview
app.get('/info', (req, res) => {
    Person.countDocuments({}, (err, count) => {
        res.send(
            `<div>Phonebook has info for ${count} people</div>
            <div>${new Date()}</div>`
        )
    })
})


//Get all people in phonebook
app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

//Get an individual entry
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                console.log('person found but formatting was off')
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

//Delete a person

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            console.log(result)
            res.status(204).end()
        })
        .catch(error => next(error))
})

//Update a phone number for an existing user
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context:'query' })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})



//Add a person
app.post('/api/persons', (req, res, next) => {

    const body = req.body
    if (!body.name) {
        return res.status(400).json({
            error: 'name is missing'
        })
    }
    if (!body.number) {
        console.log('no number!')
        return res.status(400).json({
            error: 'number is missing'
        })
    }
    if (persons.some(p => p.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
    .catch(error => next(error))

})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})