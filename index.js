const express = require('express')
const app = express()
const moment = require('moment')
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

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
    response.json(persons)
  })

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  response.json(person)
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
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    const listofnames = persons.map(p => p.name)

    body.name = listofnames

   if (!body.name) {
      return response.status(400).json({ 
        error: 'Please write a name' 
      })
    }

    if (body.name === listofnames) {
      return response.status(400).json({ 
        error: 'Name is already taken' 
      })
    }

    if (!body.number) {
      return response.status(400).json({ 
        error: 'Please fill in a number' 
      })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
    })
  

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})