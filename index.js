require('dotenv').config()
const express = require('express')
const app = express()
const moment = require('moment')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const mongoose = require('mongoose')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

morgan.token('body', req => {
  return JSON.stringify(req.body)
})




app.use(morgan(':method :url :body'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
  })

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
    response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
  })

  
app.get('/info', (request, response) => {
    const timestamps = moment().format('on YYYY:MM:DD, HH:mm:ss')
    const amountofpeople = persons.length
    response.json(`Phonebook has ${amountofpeople} people, request was made ${timestamps}`)
  })

const generateId = () => {
    const maxId = persons.length + 1
    min = Math.ceil(maxId)
    max = Math.floor(500)
    return Math.floor(Math.random() * (max - min) + min)
  }
  
  app.post('/api/persons', (request, response, next) => {
    const body = request.body
  
    const listofnames = persons.map(p => p.name)
  
    const person = new Person({
      name: body.name,
      number: body.number,
      id: generateId(),
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
  })

 


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const {content, important} = request.body

  Person.findByIdAndUpdate(request.params.id, { content, important }, { new: true, runValidators: true, content: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})
  
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

 const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})