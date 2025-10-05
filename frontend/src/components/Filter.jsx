const Filter = ({letters, handleLettersChange}) => {
  return (
    <div>
      filter shown with<input value={letters} onChange={handleLettersChange} />
    </div>
  )
}

export default Filter