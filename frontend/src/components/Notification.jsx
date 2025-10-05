const Notification = ({successMessage, errorMessage}) => {
  //2.17*
  if (successMessage === null && errorMessage === null) {
    return 
  } else if (successMessage) {
    return (
      <div className="banner" style={{color: "green"}}>
        {successMessage}
      </div>
    )
  } else if (errorMessage) {
    return (
      <div className="banner" style={{color: "red"}}>
        {errorMessage}
      </div>     
    )
  }

/*   if (message === null) return 
  
  return (
    <div className="banner banner--success">
      {message}
    </div>
  ) */
}


export default Notification