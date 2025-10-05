const Persons = ({namesToShow, handleClickToDeletePerson}) => {
  return(
    <div>
      {
        namesToShow.map(person => 
          <p key={person.id}>
            {person.name} {person.number}<button onClick={() => handleClickToDeletePerson(person)}>delete</button>
          </p>)
      }
    </div>
  )
}

export default Persons