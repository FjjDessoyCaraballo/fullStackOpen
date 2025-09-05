import { useState, useEffect } from 'react'
import contactService from './services/contacts'

const Listnames = ({name, number, deleteContact}) => <p>{name} {number} <button onClick={deleteContact}>delete</button></p>

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

const Persons = ({search, deleteContact}) => {
  return (
    <div>
      {search.map((person) => 
        <Listnames 
          key={person.id} 
          name={person.name} 
          number={person.number}
          deleteContact={deleteContact}
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
    contactService
    .getAll()
    .then(contactList => {setPersons(contactList)})
    .catch(error => {
      alert(`Error: ${error}`)
    })
  }, [])
  
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
      name: newName,
      number: newNumber,
      id: String(persons.length + 1)
    }
    contactService
    .create(nameObject)
    .then(updatedList => {
      setPersons(persons.concat(updatedList))
      setNewName('')
      setNewNumber('')
    })
  }

  const handleDeletion = id => {
    const contactToDelete = persons.find(c => c.id === id)
    console.log("This is id:", contactToDelete.id)
    if (window.confirm(`Delete ${contactToDelete.name}?`)) {
      contactService
      .deleteContact(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))

      })
      .catch(error => {
        console.error('Error deleting contact:', error)
        alert('Failed to delete contact')
      })
    }
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
      <Persons search={refinedSearch} deleteContact={handleDeletion} />
    </div>
  )
}

export default App
