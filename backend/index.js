require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('dist'))
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

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(returnedList => {
      // console.log(returnedList)
      response.json(returnedList)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  const currentDate = new Date()
  Person.find({})
    .then(returnedList => {
        response.send(
          `<p>Phonebook has info for ${returnedList.length} people</p>
          <p>${currentDate}</p>`)
    })
    .catch(error => next(error))

})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error)) 
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.number = number

      return person.save()
              .then(updatedPerson => {
                console.log(updatedPerson)
                response.json(updatedPerson)
              })
    })
    .catch(error => next(error))

  // Update validators for practices
  // validation works with or without the oprators e.g $set etc in the second parameter
/*   const opts = { runValidators: true };

  console.log(request.params.id)
  console.log(name)

  Person.updateOne({_id: request.params.id}, {name: name}, opts)
    .then((result) => {
      response.json(result)
    })
    .catch(error => next(error)) */
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})