import { useState, useEffect } from 'react'
import axios from 'axios'

const Listnames = ({name, number}) => <p>{name} {number}</p>

const Filter = ({onChange}) => <div>filter shown with: <input onChange={onChange}/></div>

const Titles = ({title}) => <h2>{title}</h2>

const Form = ({value1, value2, handleName, handleNumber, addNames}) => {
  return (
      <form onSubmit={addNames}>
        
        <div>name: <input value={value1} onChange={handleName}/></div>
        <div>number: <input value={value2} onChange={handleNumber}/></div>
        
        <div>
          <button type="submit">add</button>
        </div>
      </form> 
  )
}

const Persons = ({search}) => {
  return (
    <div>
      {search.map((person) => 
        <Listnames 
          key={person.id} 
          name={person.name} 
          number={person.number}
          />
      )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')

  useEffect(() => {
    axios
    .get('http://localhost:3001/persons')
    .then(response => {
      console.log('printing response')
      console.log(response.data)
      setPersons(response.data)
    }
    // could insert a catch here
  )}, [])
  
  const addNames = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already in the phonebook. Choose another name.`)
      return
    }

    if (newName === '' || newNumber === '') {
      alert("No fields in the form can be empty!")
      return
    }

    const nameObject = { 
      id: persons.length + 1,
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNewSearch = (event) => {
    setNewSearch(event.target.value)
  }

  const refinedSearch = newSearch 
  ? persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))
  : persons

  return (
    <div>
      <Titles title="Phonebook" />
      <Filter onChange={handleNewSearch} />
      <Titles title="add a new" />
      <Form
        addNames={addNames}
        value1={newName}
        value2={newNumber}
        handleName={handleNameChange}
        handleNumber={handleNumberChange}
      />    
      <Titles title="Numbers" />
      <Persons search={refinedSearch} />
    </div>
  )
}

export default App
