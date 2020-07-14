const mongoose = require('mongoose')

const numArgs = process.argv.length

if (numArgs < 3) {
  console.log('Please provide the correct arguments: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://quinnbutterfield:${password}@cluster0.s2er8.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const addPerson = () => {

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(result => {
    console.log('person saved!')
    console.log(result)
    mongoose.connection.close()
  })

}

const getPeople = () => {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}


if (numArgs === 5) {

  addPerson()
}
if (numArgs === 3) {

  getPeople()
}



