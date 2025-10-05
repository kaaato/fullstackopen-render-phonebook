import Add from "./Add.jsx"

const PersonForm = ({name, number, handleSubmit}) => {
  return (
    <form onSubmit={handleSubmit}>
      <Add data={name} text="name: " />
      <Add data={number} text="number: "/>
      <button type="submit">add</button>
    </form>
  )
}

export default PersonForm