import { useState, useEffect } from 'react'
import contactService from './services/contacts'
import { Notification, ErrorNotification } from './components/Notification'

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
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    contactService
    .getAll()
    .then(contactList => {setPersons(contactList)})
    .catch(error => {
      setErrorMessage(`${error}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    })
  }, [])
  
  const addNames = (event) => {
    event.preventDefault()
    
    if (newName === '' || newNumber === '') {
      setErrorMessage("Name nor number should be empty!")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
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
          setMessage(`Contact number for ${existingContact.name} has been updated`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setNewNumber('')
          setNewName('')
        })
        .catch(error => {
          setErrorMessage(`${existingContact.name} is not in the database.`)
          console.log(`${error}`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
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
        setMessage(`${newName} has been added to the list!`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
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
        setMessage(`${contactToDelete.name} has been deleted to from the list`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        setErrorMessage(`${error}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
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
      <Notification message={message} />
      <ErrorNotification message={errorMessage} />
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
