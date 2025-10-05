const mongoose = require("mongoose")

const password = process.argv[2]
const url = `mongodb+srv://kaaato_db:${password}@cluster0.mxfcarb.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model("Person", personSchema)

Person.deleteMany({})
.then(result => {
  console.log(result)
  mongoose.connection.close()
})
.catch(e => {
  console.log(e)
  mongoose.connection.close()
})

