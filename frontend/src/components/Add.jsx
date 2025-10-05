const Add = ({data, text}) => {
  return (
    <div>
      {text} <input value={data[0]} onChange={data[1]} />
    </div>
  )
}

export default Add