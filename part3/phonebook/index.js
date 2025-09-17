const express = require('express')
const morgan = require('morgan')

const app = express()

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }
// app.use(requestLogger)

function getRandomInt(max) { return Math.floor(Math.random() * max) }

const generateId = () => {
    const newId = getRandomInt(2147483646)
    return newId
}

morgan.token('personObject', (request) => { return request.createdPerson ? JSON.stringify(request.createdPerson) : '' })
morgan.token('id', (request) => { return request.createdPerson?.id ? request.createdPerson.id.toString() : '' })

app.use(express.json())
app.use(morgan(':method :url :status :id - :response-time ms :personObject'))

let persons = 
[
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

app.get('/', (request, response) => {response.json("Status: OK").send()})

app.get('/api/persons', (request, response) => {response.json(persons)})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if (person) response.json(person)
    else response.status(404).end()
})

app.get('/api/info', (request, response) => {
    const sizeOfList = persons.length
    const firstRow = `Phonebook has info for ${sizeOfList}`
    const time = new Date()
    response.send(`
        <div>
        <p>${firstRow}</p>
        <p>${time}</p>
        </div>
        `)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)
    
    if (!body.name || !body.number) {
        return response.status(400).json({error: 'content missing'})
    }
    
    const match = persons.find(p => p.name === body.name)
    if (match) return response.status(400).json({error: 'name must be unique'})

    const newPerson = {
        id: generateId().toString(),
        name: body.name,
        number: body.number,
    }

    request.createdPerson = newPerson
    persons = persons.concat(newPerson)
    response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)   

    if (person) {
        persons = persons.filter(p => p.id !== id)    
        response.status(204).end()
    }
    else response.status(404).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`${PORT}: listening`)
})