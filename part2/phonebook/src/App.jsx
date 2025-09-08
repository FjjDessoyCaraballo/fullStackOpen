import { useState, useEffect } from 'react'
import contactService from './services/contacts'

const Listnames = ({name, number, contactDelete}) => <p>{name} {number} <button onClick={contactDelete}>delete</button></p>

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

const Persons = ({search, contactDelete}) => {
  return (
    <div>
      {search.map((person) => 
        <Listnames 
          key={person.id} 
          name={person.name} 
          number={person.number}
          contactDelete={() => contactDelete(person.id)}
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
    
    if (newName === '' || newNumber === '') {
      alert("No fields in the form can be empty!")
      return
    }
  
    const existingContact = persons.find(person => person.name === newName)

    if (existingContact) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedContact = {
          ...existingContact,
          number: newNumber
        }
        contactService
        .patchContact(existingContact.id, updatedContact)
        .then(returnedContact => {
          setPersons(persons.map(person =>
            person.id !== existingContact.id ? person : returnedContact
          ))
          setNewNumber('')
          setNewName('')
        })
        .catch(error => {
          console.error('Error updating contact:', error)
        })
      }
    } else {
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
  }

  const contactDelete = id => {
    const contactToDelete = persons.find(c => c.id === id)
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
      <Persons search={refinedSearch} contactDelete={contactDelete} />
    </div>
  )
}

export default App
