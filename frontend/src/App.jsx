import { useState, useEffect } from 'react'
import personService from "./servies/persons";
import Filter from "./components/Filter"
import PersonForm from './components/PersonForm';
import Persons from "./components/Persons"
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState("")
  const [letters, setLetters] = useState("")
  const [successMessage, setSuccessMessage] = useState("build your phonebook...")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    personService
      .getAll()
      .then(initialLists => {
        // console.log(initialLists)
        setPersons(initialLists)
      })
  }, [])

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleLettersChange = (event) => setLetters(event.target.value)

  const handleSubmit = (event) => {
    event.preventDefault()

    const newPerson = {
      name: newName,
      number: newNumber,
    }

    const hasTheSameName = persons.findIndex(person => person.name === newName) >= 0
    const isTheSameNumber = persons.findIndex(person => person.number === newNumber) >= 0

    if (hasTheSameName && isTheSameNumber) {
      alert(`${newName} is already added to phonebook`)
    } else if (hasTheSameName && !isTheSameNumber) {
      const result = confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (result) {
        const person = persons.find(p => p.name === newName)
        const updatedPerson = { ...person, number: newNumber }
        personService
          .update(person.id, updatedPerson)
          .then(returnedLists => {
            setPersons(persons.map(p => (p.name === newName) ? returnedLists : p))
            showSuccessMessage(newName)
            setNewName("")
            setNewNumber("")
          })
          // 2.17*
          .catch(error => {
            alert("axios error with 404 status")
            console.log(error.message)
          })
      }
    } else if (!hasTheSameName && !isTheSameNumber) {
      personService
        .create(newPerson)
        .then(returnedLists => {
          setPersons(persons.concat(returnedLists))
          showSuccessMessage(newName)
          setNewName("")
          setNewNumber("")
          // setNewId(newId + 1)
        })
        .catch(error => {
          if(successMessage != null) setSuccessMessage(null)
          setErrorMessage(error.response.data.error)
          setTimeout(() => {
            setErrorMessage(null)
            setSuccessMessage("build your phonebook...")
          }, 5000)
          console.log(error.response.data.error)
        })
    }
  }

  const namesToShow = letters ? persons.filter(person => person.name.toLowerCase().includes(letters.toLowerCase())) : persons
  // console.log(namesToShow);

  const handleClickToDeletePerson = person => {
    const result = confirm(`Delete ${person.name}?`)
    if (result) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          // setNewId(newId - 1)
        })
    }
  }

  const showSuccessMessage = name => {
    setSuccessMessage(`Added ${name}`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000);
  }

  // 2.17*
  const showErrorMessage = name => {
    setSuccessMessage(null)
    setErrorMessage(`information of ${name} has already been removed from the server`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification successMessage={successMessage} errorMessage={errorMessage} />

      <Filter letters={letters} handleLettersChange={handleLettersChange} />

      <h3>add a new</h3>

      <PersonForm name={[newName, handleNameChange]} number={[newNumber, handleNumberChange]} handleSubmit={handleSubmit} />

      <h3>Numbers</h3>

      <Persons namesToShow={namesToShow} handleClickToDeletePerson={handleClickToDeletePerson} />
    </div>
  )
}

export default App