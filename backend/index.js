const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(cors())

morgan.token('info', (req, res) => {
  const info = {
    name: res.name,
    number: res.number
  }
  return JSON.stringify(info)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info', {
  skip: (req, res) => (req.method != "POST" || res.statusCode != 200)
}))

app.use(morgan('tiny', {
  skip: (req, res) => (req.method == "POST" && res.statusCode == 200)
}))

app.use(express.json())

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const currentDate = new Date()
  const currentEntries = persons.length
  response.send(
    `<p>Phonebook has info for ${currentEntries} people</p>
    <p>${currentDate}</p>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  // console.log(typeof id, id)
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

const generateId = (array) => {
  let id
  while (true) {
      id = Math.ceil(Math.random() + array.length)
      if (id > array.length) break;
  }
  return String(id);
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  // console.log(body.name, body.number)
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'must enter name and number'
    })
  } else if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(persons),
    name: body.name,
    number: body.number,
  }
  
  response.name = body.name
  response.number = body.number
  
  persons = persons.concat(person)
  response.json(person)
  
})


const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})